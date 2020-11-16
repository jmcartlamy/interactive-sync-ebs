const WebSocket = require('ws');

const apiTwitch = require('../twitch/api');
const { WEBSOCKET } = require('./constants');
const { verboseLog } = require('./log');
const { setUserInterface } = require('./state');
const { STRINGS } = require('../api/constants');

let wss;
const webSockets = {};

const initWebSocket = function (server) {
    if (server) {
        wss = new WebSocket.Server({
            server: server.listener,
            clientTracking: true,
        });
        verboseLog(WEBSOCKET.websocketStarted, wss.address());

        onConnection();
        onError();
        onBrokenConnection();
    } else {
        verboseLog(WEBSOCKET.websocketInitError);
    }
};

const heartbeat = function () {
    this.isAlive = true;
};

const onConnection = function () {
    wss.on('connection', (ws, req) => {
        ws.isAlive = true;
        ws.on('pong', heartbeat);

        ws.on('message', function incoming(message) {
            // Get channelId from game
            let channelId;
            try {
                channelId = JSON.parse(message).channelId;
            } catch (err) {}

            const ip = req.socket.remoteAddress;
            if (!channelId) {
                verboseLog(
                    `Channel c:${channelId} not valid with ip:${ip}. Connection will be terminated.`
                );
                ws.send(`Error: ${channelId} not valid ; connection will be terminated.`);
                ws.terminate();
            } else {
                ws.channelId = channelId;
                webSockets[channelId] = ws;

                verboseLog(`Channel c:${channelId} connected with ip:${ip}`);
                ws.send(`You are well connected with the channel ${channelId}.`);
            }
        });

        ws.on('close', () => {
            ws.send(`To c:${channelId}: connection is terminated.`);
            // Set user interface in state
            setUserInterface(channelId, {});
            // Send to broadcast twitch
            try {
                verboseLog(STRINGS.newUserInterface, channelId);
                apiTwitch.sendBroadcastMessage(channelId, {
                    type: 'user_interface',
                    data: {},
                });
            } catch (err) {
                verboseLog(err);
            }
            verboseLog(`Channel c:${channelId} disconnected.`);
        });
    });
};

const onError = function () {
    wss.on('error', (err) => verboseLog(WEBSOCKET.websocketInitError, err));
};

const onBrokenConnection = function (params) {
    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                verboseLog(`Channel c:${ws.channelId} has been disconnected for broken connection`);
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

const sendMessageToChannelId = function (channelId, type, payload) {
    wss.clients.forEach(function (client) {
        if (client.channelId === channelId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, payload }));
        }
    });
};

module.exports = {
    initWebSocket: initWebSocket,
    sendMessageToChannelId: sendMessageToChannelId,
};
