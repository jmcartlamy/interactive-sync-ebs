const Boom = require('@hapi/boom');

const { STRINGS } = require('../constants');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');
const { verboseLog } = require('../../config/log');
const { setChannelAction, getChannelAllActions } = require('../../config/state');
const { userIsInCooldown } = require('./helpers/userIsInCooldown');
const { sendMessageToChannelId } = require('../../config/socket');

/**
 * Handle a mouse event request to make an action
 */
const mouseEventHandler = async function (req) {
    // Verify all requests.
    const payload = verifyAndDecode(req.headers.authorization);
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

    // Bot abuse prevention:  don't allow a user to spam the button.
    if (userIsInCooldown(opaqueUserId, 'mouse')) {
        throw Boom.tooManyRequests(STRINGS.cooldown);
    }

    // Verify if action has been pushed recently
    if (getChannelAllActions(channelId, 'mouse') > Date.now()) {
        throw Boom.notAcceptable(STRINGS.actionInCooldown);
    }

    // Emit to videogame connected with websocket
    sendMessageToChannelId(channelId, 'mouse', req.payload);

    // New cooldown for this mouse action
    const scheduledTimestamp = Math.floor(Date.now() + 250);

    // Save the new scheduled timestamp for the type and the channel.
    setChannelAction(channelId, scheduledTimestamp, 'mouse');

    // Log new mouse down action
    const coord = 'x: ' + req.payload.clientX + ', y: ' + req.payload.clientY;
    verboseLog(STRINGS.newMouseEvent, req.payload.type, channelId, opaqueUserId, coord);

    /* 
        We don't have to broadcast a mouse event action to 
        all other extension instances on this channel. 
    */

    return req.payload;
};

module.exports = {
    mouseEventHandler: mouseEventHandler,
};
