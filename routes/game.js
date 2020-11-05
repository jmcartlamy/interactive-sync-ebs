const { searchChannelHandler } = require('../api/game/channels');
const { userInterfaceHandler } = require('../api/shared/userInterface');

module.exports = async function (server) {
    /**
     * ROUTES GAME REQUEST
     */
    server.route([
        // Handle a streamer request to search his channel
        {
            method: 'GET',
            path: '/api/channels/search/{user}',
            handler: searchChannelHandler,
        },
        // Handle a game request to update the user interface
        {
            method: 'POST',
            path: '/api/user/interface',
            handler: userInterfaceHandler,
        },
    ]);
};
