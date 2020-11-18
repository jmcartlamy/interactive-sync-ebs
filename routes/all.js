const viewerRoutes = require('./viewer');
const notFoundRoutes = require('./404');

module.exports = async function (server) {
    await viewerRoutes(server);
    await notFoundRoutes(server);
};
