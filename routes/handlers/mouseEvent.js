const Boom = require('@hapi/boom');

const { STRINGS, ACTIONS_TYPE } = require('../constants');
const { verifyAndDecode } = require('../../services/twitch/helpers/verifyAndDecode');
const { verboseLog } = require('../../config/log');
const { sendMessageToClient } = require('../websocket');
const { retrieveDisplayName } = require('./twitchHelpers/retrieveDisplayName');
const {
    mouseActionLimitIsReachedForChannel,
} = require('./mouseRateHelpers/mouseActionLimitIsReachedForChannel');
const { userIsInCooldown, actionIsInCooldownForUser } = require('./cooldownHelpers/isInCooldown');
const { registerUserCooldowns } = require('./cooldownHelpers/registerUserCooldowns');
const { findCooldownByMouseType } = require('./cooldownHelpers/findCooldown');

/**
 * Handle a mouse event request to make an action
 */
const mouseEventHandler = async function (req) {
    // Verify all requests.
    const verifiedJWT = verifyAndDecode(req.headers.authorization);
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = verifiedJWT;
    const DateNow = Date.now();
    const { type: mouseType, clientX, clientY } = req.payload;

    // Verify type parameter
    if (![ACTIONS_TYPE.mouseDown, ACTIONS_TYPE.mouseUp].includes(mouseType)) {
        throw Boom.badRequest(STRINGS.mouseTypeErroned);
    }

    // Bot abuse prevention: don't allow a user to spam the button.
    if (userIsInCooldown(opaqueUserId, mouseType, DateNow)) {
        throw Boom.tooManyRequests(STRINGS.mouseTypeInCooldown);
    }

    // Verify user don't bypass the cooldown for this mouse event
    if (actionIsInCooldownForUser(opaqueUserId, mouseType, DateNow)) {
        throw Boom.notAcceptable(STRINGS.userMouseTypeInCooldown);
    }

    // Use cooldown from user interface
    const cooldownUI = findCooldownByMouseType(channelId, mouseType);

    // Verify action id exist in the user interface
    if (!cooldownUI) {
        throw Boom.forbidden(STRINGS.actionIdErroned);
    }

    // Limit click per second for mouse event type
    if (mouseActionLimitIsReachedForChannel(channelId, { mouseType, cooldownUI }, DateNow)) {
        throw Boom.notAcceptable(STRINGS.cooldownChannel);
    }

    // Set cooldown for the current user
    registerUserCooldowns(opaqueUserId, {
        actionId: mouseType,
        type: ACTIONS_TYPE.mouse,
        cooldownUI,
        DateNow,
    });

    // Request and/or get display name if authorized by the user
    const username = await retrieveDisplayName(verifiedJWT);

    // Emit to videogame connected with websocket
    const mousePayload = {
        ...req.payload,
        username: username,
    };
    sendMessageToClient(channelId, ACTIONS_TYPE.mouse, mousePayload);

    // Log new mouse down action
    const coord = 'x: ' + clientX + ', y: ' + clientY;
    verboseLog(STRINGS.newMouseEvent, mouseType, channelId, opaqueUserId, coord);

    /* 
        We don't have to broadcast a mouse event action to 
        all other extension instances on this channel. 
    */

    return mousePayload;
};

module.exports = {
    mouseEventHandler: mouseEventHandler,
};
