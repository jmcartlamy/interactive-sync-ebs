const fs = require('fs');
const Hapi = require('@hapi/hapi');
const path = require('path');
const ext = require('commander');
require('dotenv').config();

// The developer rig uses self-signed certificates.  Node doesn't accept them
// by default.  Do not use this in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

ext.version(require('../package.json').version)
    .option('-s, --secret <secret>', 'Extension secret')
    .option('-c, --client-id <client_id>', 'Extension client ID')
    .option('-o, --owner-id <owner_id>', 'Extension owner ID')
    .parse(process.argv);

const serverOptions = {
    host: 'localhost',
    port: 8081,
    routes: {
        cors: {
            origin: ['*'],
        },
    },
};
const serverPathRoot = path.resolve(__dirname, '..', 'conf', 'server');
if (fs.existsSync(serverPathRoot + '.crt') && fs.existsSync(serverPathRoot + '.key')) {
    serverOptions.tls = {
        cert: fs.readFileSync(serverPathRoot + '.crt'),
        key: fs.readFileSync(serverPathRoot + '.key'),
    };
}

const server = new Hapi.Server(serverOptions);

module.exports = server;
