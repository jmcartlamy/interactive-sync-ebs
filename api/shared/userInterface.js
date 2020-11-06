const Boom = require('@hapi/boom');
const apiTwitch = require('../../twitch/api');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { STRINGS } = require('../constants');
const { verboseLog } = require('../../config/log');
const { getUserInterface, setUserInterface } = require('../../config/state');

/**
 * Call API Twitch to search channels
 */
const userInterfaceHandler = async function (req) {
    // TODO verify request JWT

    // Verify request
    if (!req.payload) {
        throw Boom.badRequest(STRINGS.sendUserInterfacePayloadMissing);
    }

    if (
        !req.payload.userInterface ||
        !req.payload.channelId ||
        typeof req.payload.userInterface !== 'string'
    ) {
        throw Boom.badRequest(STRINGS.sendUserInterfaceBadRequest);
    }

    // Parse JSON
    let userInterface;
    try {
        userInterface = JSON.parse(req.payload.userInterface);
    } catch (err) {
        throw Boom.badRequest(STRINGS.sendUserInterfaceSyntaxError);
    }

    const channelId = req.payload.channelId;
    // Set user interface in state
    setUserInterface(channelId, userInterface);

    // Send to broadcast twitch
    const message = {
        type: 'user_interface',
        data: userInterface,
    };
    try {
        verboseLog(STRINGS.newUserInterface, channelId);
        await apiTwitch.sendBroadcastMessage(channelId, message);
        return {
            channelId,
            userInterface,
        };
    } catch (err) {
        verboseLog(err);
        return err;
    }
};

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
    userInterfaceHandler: userInterfaceHandler,
    userInterfaceQueryHandler: userInterfaceQueryHandler,
};
