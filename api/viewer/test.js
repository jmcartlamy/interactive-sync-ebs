const color = require('color');
const Boom = require('@hapi/boom');

const { getChannelTestColor, setChannelTestColor } = require('../../config/state');
const { verboseLog } = require('../../config/log');
const { ACTIONS, STRINGS } = require('../constants');
const { userIsInCooldown } = require('./helpers/userIsInCooldown');
const { attemptTestBroadcast } = require('./helpers/attemptTestBroadcast');
const { verifyAndDecode } = require('../../twitch/helpers/verifyAndDecode');

// TEMP
const util = require('util');

/**
 * Handle a viewer request to cycle the color for testing lifecycle.
 */
const testCycleHandler = async function (req) {
    // Verify all requests.
    const payload = verifyAndDecode(req.headers.authorization);
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;

    // Store the color for the channel.
    let currentTestColor = getChannelTestColor(channelId) || ACTIONS.initialTestColor;

    // Bot abuse prevention:  don't allow a user to spam the button.
    if (userIsInCooldown(opaqueUserId, 'action')) {
        throw Boom.tooManyRequests(STRINGS.cooldown);
    }

    // Rotate the color as if on a color wheel.
    verboseLog(STRINGS.cyclingColor, channelId, opaqueUserId);

    // Simulate video game time response and change test color
    const setTimeoutPromise = util.promisify(setTimeout);
    await setTimeoutPromise(1000);
    currentTestColor = color(currentTestColor).rotate(60).hex();

    // Save the new test color for the channel.
    setChannelTestColor(channelId, currentTestColor);

    // Broadcast the test color change to all other extension instances on this channel.
    attemptTestBroadcast(channelId, currentTestColor);

    return currentTestColor;
};

/**
 * Handle a new viewer requesting the test color.
 */
const testQueryHandler = function (req) {
    // Verify all requests.
    const payload = verifyAndDecode(req.headers.authorization);

    // Get the color for the channel from the payload and return it.
    const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;
    const currentTestColor = color(
        getChannelTestColor(channelId) || ACTIONS.initialTestColor
    ).hex();
    verboseLog(STRINGS.sendColor, currentTestColor, opaqueUserId);
    return currentTestColor;
};

module.exports = {
    testCycleHandler: testCycleHandler,
    testQueryHandler: testQueryHandler,
};
