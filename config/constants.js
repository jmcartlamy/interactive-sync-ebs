const usingValue = function (name) {
    return `Using environment variable for ${name}`;
};

const missingValue = function (name, variable) {
    const option = name.charAt(0);
    return `Extension ${name} required.\nUse argument "-${option} <${name}>" or environment variable "${variable}".`;
};

const SERVER = {
    secretEnv: usingValue('secret'),
    clientIdEnv: usingValue('client-id'),
    clientSecretEnv: usingValue('client-secret'),
    ownerIdEnv: usingValue('owner-id'),
    serverStarted: 'Server running at %s',
    secretMissing: missingValue('secret', 'EXT_SECRET'),
    clientIdMissing: missingValue('client ID', 'EXT_CLIENT_ID'),
    clientSecretMissing: missingValue('client secret', 'EXT_SHARED_SECRET'),
    ownerIdMissing: missingValue('owner ID', 'EXT_OWNER_ID'),
};

const API_TWITCH = {
    messageSendError: 'Error sending message to channel %s: %s',
    pubsubResponse: 'Broadcasting message to c:%s returned %s',
    invalidAuthHeader: 'Invalid authorization header',
    invalidJwt: 'Invalid JWT',
    retrieveTokenInit: 'Get tokens from id.twitch',
    retrieveTokenError: 'Error to get tokens',
    retrieveTokenSuccess: 'Tokens received: status %s',
    searchChannelRequest: 'Get channels from api.twitch',
    searchChannelError: 'Error to get channels',
    searchChannelSuccess: 'Channels received: status %s',
    searchChannelBadRequest: 'Parameter user is missing or undefined in the request',
    retrieveUserObjectError: 'Error to get u:%s object',
    retrieveUserObjectSuccess: 'User object received: status %s',
};

const SOCKET_IO = {
    socketStarted: 'Socket.io running at %s',
    socketError: 'An error occurred during socket initialization: %s',
};

const CONFIG = {
    serverTokenDurationSec: 30, // our tokens for pubsub expire after 30 seconds
    actionCooldownMs: 3000, // minimum cooldown to prevent bot abuse
    userActionCooldownMs: 3000, // maximum input rate per user to prevent bot abuse
    userMouseEventCooldownMs: 500, // maximum mouse event rate per user to prevent bot abuse
    userCooldownClearIntervalMs: 60000, // interval to reset our tracking object
    channelCooldownMs: 1000, // maximum broadcast rate per channel
    bearerPrefix: 'Bearer ', // HTTP authorization headers have this prefix
};

module.exports = {
    SERVER: SERVER,
    API_TWITCH: API_TWITCH,
    SOCKET_IO: SOCKET_IO,
    CONFIG: CONFIG,
};
