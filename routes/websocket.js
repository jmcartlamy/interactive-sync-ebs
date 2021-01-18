const WebSocket = require('ws');

const apiTwitch = require('../services/twitch/api');
const { WEBSOCKET } = require('../config/constants');
const { verboseLog } = require('../config/log');
const { setUserInterface } = require('../db/state');
const { validateUserInterface } = require('../utils/validation/validateUserInterface');

let wss;
const webSockets = {};

const initWebSocket = function (server) {
    if (server) {
        wss = new WebSocket.Server({
            server: server.listener,
            clientTracking: true,
        });
        verboseLog(WEBSOCKET.started, wss.address());

        onConnection();
        onError();
        onBrokenConnection();
    } else {
        verboseLog(WEBSOCKET.initError);
    }
};

const heartbeat = function () {
    this.isAlive = true;
};

const onConnection = function () {
    wss.on('connection', async function connecting(ws, req) {
        ws.isAlive = true;
        ws.on('pong', heartbeat);

        const ip = req.socket.remoteAddress;

        // Verify sec-websocket-protocol
        if (!req.headers['sec-websocket-protocol']) {
            verboseLog(WEBSOCKET.protocolMissing + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.protocolMissing,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // Get client_id and access_token
        const [clientId, accessToken] = req.headers['sec-websocket-protocol'].split(', ');

        if (!clientId || !accessToken) {
            verboseLog(WEBSOCKET.protocolIncomplete + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.protocolIncomplete,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // Validate access token
        let userId;
        try {
            const body = await apiTwitch.validateAccessToken({ token: accessToken });
            if (body.status) {
                // API returns status if error
                throw body;
            }
            verboseLog(WEBSOCKET.validateAccessTokenSuccess, ip);
            if (body.user_id) {
                userId = body.user_id;
            }
        } catch (err) {
            verboseLog(WEBSOCKET.validateAccessTokenError + err.message + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.validateAccessTokenError + err.message,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // Verify user_id
        if (!userId) {
            verboseLog(WEBSOCKET.undefinedUserId + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.undefinedUserId,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // Retrieve user object to get display name
        let displayName;
        try {
            const query = { id: userId };
            const headers = { clientId, token: accessToken };

            const body = await apiTwitch.retrieveUserObject(query, headers);
            if (body.status) {
                // API returns status if error
                throw body;
            }
            verboseLog(WEBSOCKET.retrieveUserObjectSuccess, userId, ip);
            if (body.data && body.data.length) {
                const twitchUserObject = body.data[0];
                if (twitchUserObject.display_name) {
                    displayName = twitchUserObject.display_name;
                }
            }
        } catch (err) {
            verboseLog(WEBSOCKET.retrieveUserObjectError + err.message + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.retrieveUserObjectError + err.message,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // Search channel with display name
        let channelId;
        try {
            const body = await apiTwitch.searchChannels(displayName, {
                clientId,
                token: accessToken,
            });
            if (body.data && body.data.length) {
                channelId = body.data[0].id;
            }
        } catch (err) {}

        if (!channelId) {
            verboseLog(WEBSOCKET.undefinedChannelId + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.undefinedChannelId,
                    data: null,
                })
            );
            return ws.terminate();
        } else {
            ws.channelId = channelId;
            ws.userId = userId;
            webSockets[channelId] = ws;

            verboseLog(WEBSOCKET.connectionSuccessServer, channelId, userId, displayName, ip);
            ws.send(
                JSON.stringify({
                    status: 'ok',
                    context: 'connection',
                    message: WEBSOCKET.connectionSuccess,
                    data: {
                        displayName,
                        channelId,
                    },
                })
            );
        }

        ws.on('message', async function incoming(message) {
            const channelId = ws.channelId;
            // Test size of JSON
            if (message.length > 2048) {
                verboseLog(WEBSOCKET.userInterfaceLengthErrorServer, ws.channelId);
                return ws.send(
                    JSON.stringify({
                        status: 'error',
                        context: 'message',
                        message: WEBSOCKET.userInterfaceLengthError,
                        data: null,
                    })
                );
            }
            // Get channelId from game
            let body;
            try {
                body = JSON.parse(message);
            } catch (err) {
                verboseLog(WEBSOCKET.userInterfaceSyntaxErrorServer, ws.channelId);
                return ws.send(
                    JSON.stringify({
                        status: 'error',
                        context: 'message',
                        message: WEBSOCKET.userInterfaceSyntaxError,
                        data: null,
                    })
                );
            }
            if (!body.context || body.context !== 'user_interface' || !body.data) {
                verboseLog(WEBSOCKET.messageIncompleteServer, ws.channelId);
                return ws.send(
                    JSON.stringify({
                        status: 'error',
                        context: 'message',
                        message: WEBSOCKET.messageIncomplete,
                        data: null,
                    })
                );
            }

            if (!ws.channelId) {
                verboseLog(WEBSOCKET.undefinedChannelIdMessage + ' | ip:' + ip);
                ws.send(
                    JSON.stringify({
                        status: 'error',
                        context: 'message',
                        message: WEBSOCKET.undefinedChannelIdMessage,
                        data: null,
                    })
                );
                return ws.terminate();
            }

            const { isValidUI, normalizedUI, errorUI } = validateUserInterface(body.data);

            if (!isValidUI) {
                verboseLog(WEBSOCKET.userInterfaceInvalidServer + ' | ip:' + ip, ws.channelId);
                return ws.send(
                    JSON.stringify({
                        status: 'error',
                        context: 'message',
                        message: WEBSOCKET.userInterfaceInvalid,
                        data: errorUI,
                    })
                );
            }

            // Set user interface in state
            setUserInterface(channelId, normalizedUI);

            // Send to broadcast twitch
            const messageToSend = {
                type: 'user_interface',
                data: body.data,
            };
            try {
                await apiTwitch.sendBroadcastMessage(channelId, messageToSend);
                return ws.send(
                    JSON.stringify({
                        status: 'ok',
                        context: 'message',
                        message: WEBSOCKET.messageSuccess,
                        data: null,
                    })
                );
            } catch (err) {
                verboseLog(WEBSOCKET.messageError, err.message);
                return ws.send(
                    JSON.stringify({
                        status: 'error',
                        context: 'message',
                        message: err.message,
                        data: null,
                    })
                );
            }
        });

        ws.on('close', function closing() {
            const channelId = ws.channelId;
            ws.send(
                JSON.stringify({
                    status: 'ok',
                    context: 'connection',
                    message: WEBSOCKET.connectionClose,
                    data: {
                        displayName,
                        channelId,
                    },
                })
            );
            // Set user interface in state
            setUserInterface(channelId, {});
            // Send to broadcast twitch
            try {
                apiTwitch.sendBroadcastMessage(channelId, {
                    type: 'user_interface',
                    data: {},
                });
            } catch (err) {
                verboseLog(err);
            }
            verboseLog(WEBSOCKET.connectionCloseServer, channelId, ws.userId);
        });
    });
};

const onError = function () {
    wss.on('error', function error(err) {
        verboseLog(WEBSOCKET.initError, err);
    });
};

const onBrokenConnection = function () {
    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                verboseLog(WEBSOCKET.connectionBroken, ws.channelId);
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping(function () {});
        });
    }, 60000);

    wss.on('close', function close() {
        clearInterval(interval);
    });
};

const sendMessageToClient = function (channelId, type, payload) {
    wss.clients.forEach(function each(client) {
        if (client.channelId === channelId && client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    status: 'ok',
                    context: 'emit',
                    message: null,
                    data: { type, payload },
                })
            );
        }
    });
};

module.exports = {
    initWebSocket: initWebSocket,
    sendMessageToClient: sendMessageToClient,
};
