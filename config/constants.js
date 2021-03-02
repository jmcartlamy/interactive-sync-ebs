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
    pubsubResponse: 'Broadcasting %s message to c:%s returned %s',
    invalidAuthHeader: 'Invalid authorization header',
    invalidJwt: 'Invalid JWT',
    retrieveTokenInit: 'Get tokens from id.twitch',
    retrieveTokenError: 'Error to get tokens',
    retrieveTokenSuccess: 'Tokens received for server: status %s',
    searchChannelRequest: 'Get channels for "%s" from api.twitch',
    searchChannelError: 'Error to get channels',
    searchChannelSuccess: 'Channels received: status %s',
    searchChannelBadRequest: 'Parameter user is missing or undefined in the request',
    retrieveUserObjectRequest: 'Get u:%s details from api.twitch',
    retrieveUserObjectError: 'Error to get u:%s object',
    retrieveUserObjectSuccess: 'User object received: status %s',
    validateAccessTokenRequest: 'Validate access token from id.twitch/oauth2',
    validateAccessTokenError: 'Error status %s: %s',
    validateAccessTokenSuccess: 'Access token is valid: status %s',
};

const WEBSOCKET = {
    started: 'WebSocket server running: %s',
    initError: 'An error occurred during socket initialization: %s',
    underlyingError: 'An error occurred: %s',
    queryParamsMissing: 'Query parameters are missing ; connection will be terminated.',
    queryParamsIncomplete: 'ClientID or accessToken is missing ; connection will be terminated.',
    validateAccessTokenSuccess: 'Access token is valid for ip:%s.',
    validateAccessTokenError: 'An error occurred on token validation: ',
    undefinedUserId:
        'We cant find user_id with your token. It must be an user access token retrieved with implitit code flow or authorization code flow.',
    retrieveUserObjectSuccess: 'Receive u:%s details with ip:%s.',
    retrieveUserObjectError: 'An error occurred to retrieve user details: ',
    undefinedChannelId: 'We cant find channel_id with the user_id ; connection will be terminated.',
    connectionSuccess: 'You are well connected with the channel',
    connectionSuccessServer: 'Channel c:%s with user named "%s" connected with ip:%s',
    connectionClose: 'Connection is terminated.',
    connectionCloseServer: 'Channel c:%s with user named %s disconnected.',
    connectionBroken: 'Channel c:%s has been disconnected for broken connection',
    messageIncomplete: 'Context or data is missing ; message is ignored.',
    messageIncompleteServer: 'Channel c:%s: context or data is missing ; message is ignored.',
    userInterfaceSyntaxError:
        'A parsing error occured with the JSON received ; message is ignored.',
    userInterfaceSyntaxErrorServer:
        'Channel c:%s: a parsing error occured with the JSON received ; message is ignored.',
    userInterfaceLengthError: 'Size of the JSON received is too big ; message is ignored.',
    userInterfaceLengthErrorServer:
        'Channel c:%s: size of the JSON received is too big ; message is ignored.',
    userInterfaceInvalid: 'JSON received is invalid ; message is ignored.',
    userInterfaceInvalidServer: 'Channel c:%s: JSON received is invalid ; message is ignored.',
    userInterfaceSameId:
        'JSON received has an identical ID than the previous ; message is ignored.',
    userInterfaceSameIdServer:
        'Channel c:%s: JSON received has an identical ID than the previous ; message is ignored.',
    undefinedChannelIdMessage:
        'For unknown reasons, channelID is undefined ; connection will be terminated.',
    messageError: 'Error during transfer to Twitch API: %s',
    messageSuccess: 'Message was well received and transfered to Twitch API.',
    messageSuccessServer: 'Channel c:%s: message received and transfered to Twitch API.',
};

const CONFIG = {
    serverTokenDurationSec: 30, // our tokens for pubsub expire after 30 seconds
    inputCooldownMs: 3000, // minimum cooldown to prevent bot abuse
    mouseEventCooldownMs: 1000, // minimum cooldown including limit registered in current user interface
    userInputEventCooldownMs: 3000, // maximum input event rate per user to prevent bot abuse
    userMouseEventCooldownMs: 1000, // maximum mouse event rate per user to prevent bot abuse
    userCooldownClearIntervalMs: 60000, // interval to reset our tracking object
    channelCooldownMs: 1000, // maximum broadcast rate per channel
    bearerPrefix: 'Bearer ',
    oauthPrefix: 'OAuth ',
};

module.exports = {
    SERVER: SERVER,
    API_TWITCH: API_TWITCH,
    WEBSOCKET: WEBSOCKET,
    CONFIG: CONFIG,
};
