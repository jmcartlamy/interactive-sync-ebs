const Boom = require('@hapi/boom');

const { STRINGS } = require('../constants');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { verboseLog } = require('../../config/log');
const { userIsInCooldown } = require('./helpers/userIsInCooldown');
const { sendMessageToClient } = require('../../routes/websocket');
const { retrieveDisplayName } = require('./helpers/retrieveDisplayName');
const { mouseActionLimitIsReached } = require('./helpers/mouseActionLimitIsReached');

/**
 * Handle a mouse event request to make an action
 */
const mouseEventHandler = async function (req) {
    // Verify all requests.
    const verifiedJWT = verifyAndDecode(req.headers.authorization);
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = verifiedJWT;

    // Bot abuse prevention:  don't allow a user to spam the button.
    if (userIsInCooldown(opaqueUserId, 'mouse')) {
        throw Boom.tooManyRequests(STRINGS.cooldown);
    }

    // Limit click per second for mouse event
    if (mouseActionLimitIsReached(channelId, req.payload.cooldown.limit)) {
        throw Boom.notAcceptable(STRINGS.cooldownChannel);
    }

    // Request and/or get display name if authorized by the user
    const username = await retrieveDisplayName(verifiedJWT);

    // Emit to videogame connected with websocket
    const mousePayload = {
        ...req.payload,
        username: username,
    };
    sendMessageToClient(channelId, 'mouse', mousePayload);

    // Log new mouse down action
    const coord = 'x: ' + req.payload.clientX + ', y: ' + req.payload.clientY;
    verboseLog(STRINGS.newMouseEvent, req.payload.type, channelId, opaqueUserId, coord);

    /* 
        We don't have to broadcast a mouse event action to 
        all other extension instances on this channel. 
    */

    return mousePayload;
};

module.exports = {
    mouseEventHandler: mouseEventHandler,
};
