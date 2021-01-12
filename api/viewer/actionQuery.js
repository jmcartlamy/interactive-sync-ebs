const { verboseLog } = require('../../config/log');
const { getChannelAllActions } = require('../../config/state');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { STRINGS } = require('../constants');

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
    actionQueryHandler: actionQueryHandler,
};
