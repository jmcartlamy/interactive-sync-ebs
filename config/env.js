const ext = require('commander');
const { SERVER } = require('./constants');

/**
 * Get options from the command line or the environment.
 */
const getOption = function (optionName, environmentName) {
    const option = (() => {
        if (ext[optionName]) {
            return ext[optionName];
        } else if (process.env[environmentName]) {
            console.log(SERVER[optionName + 'Env']);
            return process.env[environmentName];
        }
        console.log(SERVER[optionName + 'Missing']);
        process.exit(1);
    })();

    if (!['secret', 'clientId', 'clientSecret', 'blacklistUri'].includes(optionName)) {
        console.log(`Using "${option}" for ${optionName}`);
    }
    return option;
};
module.exports = {
    ownerId: getOption('ownerId', 'EXT_OWNER_ID'),
    host: getOption('host', 'EXT_HOST'),
    secret: Buffer.from(getOption('secret', 'EXT_SHARED_SECRET'), 'base64'),
    clientId: getOption('clientId', 'EXT_CLIENT_ID'),
    clientSecret: getOption('clientSecret', 'EXT_CLIENT_SECRET'),
    blacklistUri: getOption('blacklistUri', 'EXT_BLACKLIST_URI'),
    verboseLogging: true, // @TODO set to env,
};
