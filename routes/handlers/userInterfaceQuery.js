const { verifyAndDecode } = require('../../services/twitch/helpers/verifyAndDecode');
const { STRINGS } = require('../constants');
const { verboseLog } = require('../../config/log');
const { getUserInterface } = require('../../db/state');

/**
 * Handle a viewer requesting the user interface
 */
const userInterfaceQueryHandler = function (req) {
    // Verify all requests.
    const payload = verifyAndDecode(req.headers.authorization);

    // Get the cooldown for the channel from the payload and return it.
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;
    const userInterface = getUserInterface(channelId);
    if (userInterface) {
        verboseLog(STRINGS.sendUserInterface, userInterface, opaqueUserId);
        return userInterface;
    }
    return null;
};

module.exports = {
    userInterfaceQueryHandler: userInterfaceQueryHandler,
};
