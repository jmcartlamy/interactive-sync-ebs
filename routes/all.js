const viewerRoutes = require('./viewer');
const gameRoutes = require('./game');
const notFoundRoutes = require('./404');

module.exports = async function (server) {
    await viewerRoutes(server);
    await gameRoutes(server);
    await notFoundRoutes(server);
}