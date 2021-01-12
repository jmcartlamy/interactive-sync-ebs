const Boom = require('@hapi/boom');

const { STRINGS, ACTIONS_TYPE } = require('../constants');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { verboseLog } = require('../../config/log');
const { setChannelActionCooldown } = require('../../config/state');
const { attemptActionBroadcast } = require('./helpers/attemptActionBroadcast');
const { sendMessageToClient } = require('../../routes/websocket');
const { retrieveDisplayName } = require('./helpers/retrieveDisplayName');
const { CONFIG } = require('../../config/constants');
const { findCooldownByViewAndActionId } = require('./helpers/findCooldownByViewAndActionId');
const { registerUserCooldowns } = require('./helpers/registerUserCooldowns');
const {
    userIsInCooldown,
    actionIsInCooldownForChannel,
    actionIsInCooldownForUser,
} = require('./helpers/cooldown');

/**
 * Handle an input event request to make an action
 */
const inputEventHandler = async function (req) {
    // Verify the request.
    const verifiedJWT = verifyAndDecode(req.headers.authorization);

    const { channel_id: channelId, opaque_user_id: opaqueUserId } = verifiedJWT;
    const { id: actionId, view } = req.payload;
    const DateNow = Date.now();

    // Verify actionId parameter
    if (!['panel', 'mobile', 'video_overlay'].includes(view)) {
        throw Boom.badRequest(STRINGS.actionViewErroned);
    }

    // Bot abuse prevention: don't allow a user to spam.
    if (userIsInCooldown(opaqueUserId, ACTIONS_TYPE.input, DateNow)) {
        throw Boom.tooManyRequests(STRINGS.userInCooldown);
    }

    // Verify if action has been pushed recently if broadcast is activated
    if (actionIsInCooldownForChannel(channelId, actionId, DateNow)) {
        throw Boom.notAcceptable(STRINGS.actionInCooldown);
    }

    // Verify user don't bypass the cooldown for this action
    if (actionIsInCooldownForUser(opaqueUserId, actionId, DateNow)) {
        throw Boom.notAcceptable(STRINGS.userActionInCooldown);
    }

    // Use cooldown from user interface
    const cooldownUI = findCooldownByViewAndActionId(view, channelId, actionId);

    // Verify action id exist in the user interface
    if (!cooldownUI) {
        throw Boom.forbidden(STRINGS.actionIdErroned);
    }

    // Request and/or get display name if authorized by the user
    const username = await retrieveDisplayName(verifiedJWT);

    // Log new input action
    verboseLog(STRINGS.newAction, channelId, opaqueUserId);

    // Emit to videogame connected with websocket
    const inputPayload = {
        ...req.payload,
        username: username,
    };
    sendMessageToClient(channelId, ACTIONS_TYPE.input, inputPayload);

    // Set cooldown for the current user
    registerUserCooldowns(opaqueUserId, {
        actionId,
        type: ACTIONS_TYPE.input,
        cooldownUI,
        DateNow,
    });

    // Save and broadcast cooldown only if broadcast is activated
    if (cooldownUI && cooldownUI.broadcast) {
        // Get duration of cooldown
        const actionCooldownDuration =
            cooldownUI.duration < CONFIG.inputCooldownMs
                ? CONFIG.inputCooldownMs
                : cooldownUI.duration;

        // New cooldown for this action
        const scheduledTimestamp = Math.floor(DateNow + actionCooldownDuration);

        // Save the new scheduled timestamp for the type and the channel.
        setChannelActionCooldown(channelId, scheduledTimestamp, actionId);

        // Broadcast the new action to all other extension instances on this channel.
        attemptActionBroadcast(channelId, actionCooldownDuration, actionId);
    }

    return cooldownUI;
};

module.exports = {
    inputEventHandler: inputEventHandler,
};
