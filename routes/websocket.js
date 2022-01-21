const WebSocket = require('ws');

const apiTwitch = require('../services/twitch/api');
const containerAzure = require('../services/azure/container');
const { CONFIG, WEBSOCKET } = require('../config/constants');
const { verboseLog } = require('../config/log');
const { getUserInterface, setUserInterface } = require('../db/state');
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

        // Verify query params
        if (req.url === '' || req.url === '/' || !req.url) {
            verboseLog(WEBSOCKET.queryParamsMissing + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.queryParamsMissing,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // Get client_id and access_token
        const sanitizedURL = req.url.charAt('/') ? req.url.slice(1) : req.url;
        const queryParams = new URLSearchParams(sanitizedURL);

        const clientId = queryParams.get('client_id');
        const accessToken = queryParams.get('access_token');

        if (!clientId || !accessToken) {
            verboseLog(WEBSOCKET.queryParamsIncomplete + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.queryParamsIncomplete,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // Check in the blacklist if a match exists with client_id
        try {
            const body = await containerAzure.retrieveBlacklist();

            if (body.blacklist && body.blacklist.length) {
                const clientIdIsBlacklisted = body.blacklist.find(function (item) {
                    return item === clientId;
                });
                if (clientIdIsBlacklisted) {
                    throw {
                        message: WEBSOCKET.clientIdBlacklisted,
                        clientId: clientIdIsBlacklisted,
                    };
                }
                verboseLog(WEBSOCKET.clientIdVerificationSuccess, ip);
            }
        } catch (err) {
            //prettier-ignore
            verboseLog(WEBSOCKET.clientIdVerificationError + err.message + ' ' + (err.clientId || '') + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.clientIdVerificationError + err.message,
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

        // Set the broadcaster configuration segment for the extension (we send the host name)
        try {
            const headers = { clientId, token: accessToken };

            const body = await apiTwitch.setExtensionConfiguration(userId, headers);
            if (body.statusCode !== 204) {
                // API returns error
                throw body;
            }
            verboseLog(WEBSOCKET.setExtensionConfigurationSuccess, userId);
        } catch (err) {
            verboseLog(WEBSOCKET.setExtensionConfigurationError + err.message + ' | ip:' + ip);
            ws.send(
                JSON.stringify({
                    status: 'error',
                    context: 'connection',
                    message: WEBSOCKET.setExtensionConfigurationError + err.message,
                    data: null,
                })
            );
            return ws.terminate();
        }

        // ChannelID is the same ID than userId
        const channelId = userId;
        ws.channelId = channelId;
        ws.clientId = clientId;
        webSockets[channelId] = ws;

        // Warn about spam / bot
        ws.warningCount = 0;
        ws.lastMessage = 0;

        verboseLog(WEBSOCKET.connectionSuccessServer, channelId, displayName, ip);
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

        ws.on('message', async function incoming(message) {
            const channelId = ws.channelId;
            const DateNow = Date.now();

            // Verify time between each message
            if (ws.lastMessage + CONFIG.wsMessageCooldownMs > DateNow) {
                // Verify spam / bot
                if (ws.lastMessage + 100 > DateNow) {
                    verboseLog(
                        WEBSOCKET.userInterfaceAvoidSpamServer + ' | ip:' + ip,
                        ws.channelId
                    );
                    ws.send(
                        JSON.stringify({
                            status: 'error',
                            context: 'message',
                            message: WEBSOCKET.userInterfaceAvoidSpam,
                            data: null,
                        })
                    );
                    return ws.terminate();
                } else {
                    ws.warningCount += 1;
                    verboseLog(
                        WEBSOCKET.userInterfaceMaxRateExceededServer + ' | ip:' + ip,
                        ws.channelId
                    );
                    ws.send(
                        JSON.stringify({
                            status: 'warning',
                            context: 'message',
                            message: WEBSOCKET.userInterfaceMaxRateExceeded,
                            data: null,
                        })
                    );
                    if (ws.warningCount >= CONFIG.wsWarningNumberLimit) {
                        onWarningNumberLimit(ws, ip);
                    }
                    return;
                }
            }

            ws.lastMessage = DateNow;

            // Length user interface (2048) + length message (46)
            if (message.length > 2094) {
                // Test size of JSON
                ws.warningCount += 1;
                verboseLog(WEBSOCKET.userInterfaceLengthErrorServer, ws.channelId);
                ws.send(
                    JSON.stringify({
                        status: 'warning',
                        context: 'message',
                        message: WEBSOCKET.userInterfaceLengthError,
                        data: null,
                    })
                );
                if (ws.warningCount >= CONFIG.wsWarningNumberLimit) {
                    onWarningNumberLimit(ws, ip);
                }
                return;
            }
            // Get channelId from game
            let body;
            try {
                body = JSON.parse(message);
            } catch (err) {
                ws.warningCount += 1;
                verboseLog(WEBSOCKET.userInterfaceSyntaxErrorServer, ws.channelId);
                ws.send(
                    JSON.stringify({
                        status: 'warning',
                        context: 'message',
                        message: WEBSOCKET.userInterfaceSyntaxError,
                        data: null,
                    })
                );
                if (ws.warningCount >= CONFIG.wsWarningNumberLimit) {
                    onWarningNumberLimit(ws, ip);
                }
                return;
            }
            // Test context and message
            if (!body.context || body.context !== 'user_interface' || !body.data) {
                ws.warningCount += 1;
                verboseLog(WEBSOCKET.messageIncompleteServer, ws.channelId);
                ws.send(
                    JSON.stringify({
                        status: 'warning',
                        context: 'message',
                        message: WEBSOCKET.messageIncomplete,
                        data: null,
                    })
                );
                if (ws.warningCount >= CONFIG.wsWarningNumberLimit) {
                    onWarningNumberLimit(ws, ip);
                }
                return;
            }

            // Verify channelId still exist
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

            // Validate user interface received
            const { isValidUI, normalizedUI, errorUI } = validateUserInterface(body.data);

            if (!isValidUI) {
                ws.warningCount += 1;
                verboseLog(WEBSOCKET.userInterfaceInvalidServer + ' | ip:' + ip, ws.channelId);
                ws.send(
                    JSON.stringify({
                        status: 'warning',
                        context: 'message',
                        message: WEBSOCKET.userInterfaceInvalid,
                        data: errorUI,
                    })
                );
                if (ws.warningCount >= CONFIG.wsWarningNumberLimit) {
                    onWarningNumberLimit(ws, ip);
                }
                return;
            }

            // Verify new UI's ID is not identical to previous UI's ID
            const userInterface = getUserInterface(channelId);
            if (userInterface && userInterface.id === body.data.id) {
                ws.warningCount += 1;
                verboseLog(WEBSOCKET.userInterfaceSameIdServer + ' | ip:' + ip, ws.channelId);
                ws.send(
                    JSON.stringify({
                        status: 'warning',
                        context: 'message',
                        message: WEBSOCKET.userInterfaceSameId,
                        data: {
                            previousID: userInterface.id,
                            newID: body.data.id,
                        },
                    })
                );
                if (ws.warningCount >= CONFIG.wsWarningNumberLimit) {
                    onWarningNumberLimit(ws, ip);
                }
                return;
            }

            // Set user interface in state
            setUserInterface(channelId, normalizedUI);

            // Send to broadcast twitch
            const messageToSend = {
                type: 'user_interface',
                data: normalizedUI,
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
            verboseLog(WEBSOCKET.connectionCloseServer, channelId, displayName);
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

const onWarningNumberLimit = function (ws, ip) {
    verboseLog(WEBSOCKET.userInterfaceWarningLimitExceededServer + ' | ip:' + ip, ws.channelId);
    ws.send(
        JSON.stringify({
            status: 'error',
            context: 'message',
            message: WEBSOCKET.userInterfaceWarningLimitExceeded,
            data: { limit: CONFIG.wsWarningNumberLimit },
        })
    );
    return ws.terminate();
};

module.exports = {
    initWebSocket: initWebSocket,
    sendMessageToClient: sendMessageToClient,
};
