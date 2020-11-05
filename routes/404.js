module.exports = async function (server) {
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
