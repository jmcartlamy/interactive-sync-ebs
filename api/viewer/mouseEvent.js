const Boom = require('@hapi/boom');

const { STRINGS } = require('../constants');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { verboseLog } = require('../../config/log');
const { setChannelAction } = require('../../config/state');
const { userIsInCooldown } = require('./helpers/userIsInCooldown');
const { sendMessageToClient } = require('../../routes/websocket');
const { retrieveDisplayName } = require('./helpers/retrieveDisplayName');

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
    // Request and/or get display name if authorized by the user
    const username = await retrieveDisplayName(verifiedJWT);

    // Emit to videogame connected with websocket
    const mousePayload = {
        ...req.payload,
        username: username,
    };
    sendMessageToClient(channelId, 'mouse', mousePayload);

    // TODO count number of click per seconde (< 5)
    // TODO cooldown mouse
    // New cooldown for this mouse action
    const scheduledTimestamp = Math.floor(Date.now() + 1000);

    // Save the new scheduled timestamp for the type and the channel.
    setChannelAction(channelId, scheduledTimestamp, 'mouse');

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
