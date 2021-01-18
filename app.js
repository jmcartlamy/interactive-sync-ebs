/**
 *    Extensions Backend Service (EBS)
 *    Started with https://github.com/twitchdev/extensions-hello-world
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 */

const server = require('./config/server');

/* ------------------------------------------- */

const { CONFIG, SERVER } = require('./config/constants');
const routes = require('./routes/routes');
const socket = require('./routes/websocket');
const oauth2 = require('./services/twitch/oauth2');

(async () => {
    // Set routes
    await routes(server);

    // Start the server.
    await server.start();
    console.log(SERVER.serverStarted, server.info.uri);

    // Start WebSocket Server
    socket.initWebSocket(server);

    // Get token for server-to-server API requests
    await oauth2.retrieveTokens();

    // TODO
    // Periodically clear cool-down tracking to prevent unbounded growth due to
    // per-session logged-out user tokens.
    setInterval(() => {
        userCooldowns = {};
    }, CONFIG.userCooldownClearIntervalMs);
})();
