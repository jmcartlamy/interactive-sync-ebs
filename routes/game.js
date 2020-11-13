const Joi = require('@hapi/joi');
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
            options: {
                validate: {
                    params: Joi.object({
                        user: Joi.string().min(1).max(64),
                    }),
                },
                response: {
                    schema: Joi.object({
                        channelId: Joi.string().min(1).max(64).required(),
                    }),
                    failAction: 'log',
                },
            },
        },
        // Handle a game request to update the user interface
        {
            method: 'POST',
            path: '/api/user/interface',
            handler: userInterfaceHandler,
            options: {
                validate: {
                    payload: Joi.object({
                        userInterface: Joi.string().min(1).max(2048).required(),
                        channelId: Joi.string().min(1).max(64).required(),
                    }),
                },
                response: {
                    schema: Joi.object({
                        userInterface: Joi.string().min(1).max(2048).required(),
                        channelId: Joi.string().min(1).max(64).required(),
                    }),
                    failAction: 'log',
                },
            },
        },
    ]);
};
