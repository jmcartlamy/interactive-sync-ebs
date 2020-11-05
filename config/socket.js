const SocketIO = require('socket.io');
const server = require('./server');
const apiTwitch = require('../twitch/api');
const { SOCKET_IO } = require('./constants');
const { verboseLog } = require('./log');
const { setUserInterface } = require('./state');
const { STRINGS } = require('../api/constants');

let io;

const initSocketIO = function (listener, callback) {
    io = SocketIO.listen(listener);
    verboseLog(SOCKET_IO.socketStarted, server.info.uri);

    io.on('connection', (socket) => {
        const channelId = socket.handshake.query && socket.handshake.query.channelId;

        if (!channelId) {
            socket.disconnect(true);
        } else {
            verboseLog(`Channel c:${channelId} connected`);

            socket.on('disconnect', () => {
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
                verboseLog(`Channel c:${channelId} disconnected`);
            });
        }
    });
};

const emitBroadcast = function (type, message) {
    io.emit(type, message);
};

const onMessage = function (type, callback) {
    io.on('connection', (socket) => {
        socket.on(type, (data) => {
            callback(data);
        });
    });
};

const removeListener = function (type) {
    io.on('connection', (socket) => {
        socket.removeListener(type);
    });
};

module.exports = {
    initSocketIO: initSocketIO,
    emitBroadcast: emitBroadcast,
    onMessage: onMessage,
    removeListener: removeListener,
};
