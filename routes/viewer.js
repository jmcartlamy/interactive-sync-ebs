const { actionHandler, actionQueryHandler } = require('../api/viewer/action');
const { mouseEventHandler } = require('../api/viewer/mouseEvent');
const { userInterfaceQueryHandler } = require('../api/shared/userInterface');

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
        },
        // Handle a viewer requesting the user interface
        {
            method: 'GET',
            path: '/user/interface/query',
            handler: userInterfaceQueryHandler,
        },
    ]);
};
