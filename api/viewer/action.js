const Boom = require('@hapi/boom');

const { STRINGS } = require('../constants');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { verboseLog } = require('../../config/log');
const {
    setChannelAction,
    getChannelAction,
    getChannelAllActions,
    getUserInterface,
} = require('../../config/state');
const { attemptActionBroadcast } = require('./helpers/attemptActionBroadcast');
const { userIsInCooldown } = require('./helpers/userIsInCooldown');
const { sendMessageToClient } = require('../../routes/websocket');
const { retrieveDisplayName } = require('./helpers/retrieveDisplayName');
const { CONFIG } = require('../../config/constants');
const { findCooldownByViewAndActionId } = require('./helpers/findCooldownByViewAndActionId');

/**
 * Handle a viewer request to make an action
 */
const actionHandler = async function (req) {
    // Verify the request.
    const verifiedJWT = verifyAndDecode(req.headers.authorization);

    // Request and/or get display name if authorized by the user
    const username = await retrieveDisplayName(verifiedJWT);

    const { channel_id: channelId, opaque_user_id: opaqueUserId } = verifiedJWT;
    const { id: actionId, view } = req.payload;

    // Verify actionId
    if (!['panel', 'mobile', 'video_overlay'].includes(view)) {
        throw Boom.tooManyRequests(STRINGS.actionViewErroned);
    }

    // Bot abuse prevention:  don't allow a user to spam the button.
    if (userIsInCooldown(opaqueUserId, 'action')) {
        throw Boom.tooManyRequests(STRINGS.cooldown);
    }

    // Verify if action has been pushed recently
    if (getChannelAction(channelId, actionId) > Date.now()) {
        throw Boom.notAcceptable(STRINGS.actionInCooldown);
    }

    // Log new action
    verboseLog(STRINGS.newAction, channelId, opaqueUserId);

    // Emit to videogame connected with websocket
    const actionPayload = {
        ...req.payload,
        username: username,
    };
    sendMessageToClient(channelId, 'action', actionPayload);

    // Use cooldown from user interface
    const userInterface = getUserInterface(channelId);
    const userInterfaceCooldown = findCooldownByViewAndActionId(view, actionId, userInterface);
    const cooldownAction =
        userInterfaceCooldown < 3000 ? CONFIG.actionCooldownMs : userInterfaceCooldown;

    // New cooldown for this action
    const scheduledTimestamp = Math.floor(Date.now() + cooldownAction);

    // Save the new scheduled timestamp for the type and the channel.
    setChannelAction(channelId, scheduledTimestamp, actionId);

    // Broadcast the new action to all other extension instances on this channel.
    attemptActionBroadcast(channelId, cooldownAction, actionId);

    return cooldownAction;
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
