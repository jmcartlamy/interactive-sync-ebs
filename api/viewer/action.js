const Boom = require('@hapi/boom');

const { STRINGS, ACTIONS_TYPE } = require('../constants');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { verboseLog } = require('../../config/log');
const { setChannelActionCooldown, getChannelAllActions } = require('../../config/state');
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
 * Handle a viewer request to make an action
 */
const actionHandler = async function (req) {
    // Verify the request.
    const verifiedJWT = verifyAndDecode(req.headers.authorization);

    const { channel_id: channelId, opaque_user_id: opaqueUserId } = verifiedJWT;
    const { id: actionId, view } = req.payload;
    const DateNow = Date.now();

    // Verify actionId param
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

    // Log new action
    verboseLog(STRINGS.newAction, channelId, opaqueUserId);

    // Emit to videogame connected with websocket
    const actionPayload = {
        ...req.payload,
        username: username,
    };
    sendMessageToClient(channelId, ACTIONS_TYPE.input, actionPayload);

    // Set cooldown for the current user
    // prettier-ignore
    registerUserCooldowns(opaqueUserId, { actionId, type: ACTIONS_TYPE.input, cooldownUI, DateNow });

    // Save and broadcast cooldown only if broadcast is activated
    if (cooldownUI && cooldownUI.broadcast) {
        // Get duration of cooldown
        const actionCooldownDuration =
            cooldownUI.duration < CONFIG.actionCooldownMs
                ? CONFIG.actionCooldownMs
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

/**
 * Handle a new viewer requesting the actions
 */
const actionQueryHandler = function (req) {
    // Verify all requests.
    const payload = verifyAndDecode(req.headers.authorization);

    // Get the cooldown for the channel from the payload and return it.
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;
    const actions = getChannelAllActions(channelId);
    const stringifiedActions = JSON.stringify(actions);
    verboseLog(STRINGS.sendAction, stringifiedActions, opaqueUserId);
    return stringifiedActions;
};

module.exports = {
    actionHandler: actionHandler,
    actionQueryHandler: actionQueryHandler,
};
