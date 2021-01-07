const Joi = require('joi');

const { actionHandler, actionQueryHandler } = require('../api/viewer/action');
const { mouseEventHandler } = require('../api/viewer/mouseEvent');
const { userInterfaceQueryHandler } = require('../api/viewer/userInterface');

// TODO https://hapi.dev/api/?v=20.0.2#-routeoptionssecurity

module.exports = async function (server) {
    /**
     * ROUTES VIEWER REQUEST
     */
    server.route([
        // Handle a viewer request to make an action
        {
            method: 'POST',
            path: '/action/new',
            handler: actionHandler,
            options: {
                validate: {
                    payload: Joi.object({
                        id: Joi.string().min(1).max(64).required(),
                        view: Joi.string().max(64).required(),
                        values: Joi.object()
                            .pattern(Joi.string().min(1).max(64), Joi.string().max(128))
                            .max(4),
                    }),
                },
            },
        },
        // Handle a new viewer requesting actions properties.
        {
            method: 'GET',
            path: '/action/query',
            handler: actionQueryHandler,
        },
        // Handle a viewer request to make a mouse action
        {
            method: 'POST',
            path: '/mouse/send',
            handler: mouseEventHandler,
            options: {
                validate: {
                    payload: Joi.object({
                        id: Joi.string().min(1).max(64).required(),
                        type: Joi.string().min(1).max(64).required(),
                        cooldown: Joi.object({
                            duration: Joi.number().integer().min(1000).max(30000).required(),
                            limit: Joi.number().integer().min(1).max(10).required(),
                        }).required(),
                        clientWidth: Joi.number().integer().min(1).max(7680).required(),
                        clientHeight: Joi.number().integer().min(1).max(7680).required(),
                        clientX: Joi.number().integer().min(1).max(7680).required(),
                        clientY: Joi.number().integer().min(1).max(7680).required(),
                    }).required(),
                },
            },
        },
        // Handle a viewer requesting the user interface
        {
            method: 'GET',
            path: '/user/interface/query',
            handler: userInterfaceQueryHandler,
        },
    ]);
};
