const { actionQueryHandler } = require('./handlers/actionQuery');
const { inputEventHandler } = require('./handlers/inputEvent');
const { mouseEventHandler } = require('./handlers/mouseEvent');
const { userInterfaceQueryHandler } = require('./handlers/userInterfaceQuery');
const { inputEventSchema } = require('../utils/validation/schema/inputEvent');
const { mouseEventSchema } = require('../utils/validation/schema/mouseEvent');

const viewerRoutes = async function (server) {
    /**
     * ROUTES VIEWER REQUEST
     */
    server.route([
        // Handle a viewer request to make an action
        {
            method: 'POST',
            path: '/action/input',
            handler: inputEventHandler,
            options: {
                validate: {
                    payload: inputEventSchema,
                },
            },
        },
        // Handle a viewer request to make a mouse action
        {
            method: 'POST',
            path: '/action/mouse',
            handler: mouseEventHandler,
            options: {
                validate: {
                    payload: mouseEventSchema,
                },
            },
        },
        // Handle a new viewer requesting actions properties.
        {
            method: 'GET',
            path: '/action/query',
            handler: actionQueryHandler,
        },
        // Handle a viewer requesting the user interface
        {
            method: 'GET',
            path: '/user/interface/query',
            handler: userInterfaceQueryHandler,
        },
    ]);
};

const notFoundRoutes = async function (server) {
    /**
     * ROUTE 404
     */
    server.route({
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return '404 Error! Page Not Found!';
        },
    });
};

module.exports = async function (server) {
    await viewerRoutes(server);
    await notFoundRoutes(server);
};
