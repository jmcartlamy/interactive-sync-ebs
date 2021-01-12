const { setChannelActionCooldown } = require('../../../config/state');

/**
 * Register to limit click per second for mouse event
 */

module.exports.registerMouseActionForChannel = function (
    channelId,
    channelTypeMouseCooldown,
    params,
    DateNow
) {
    const array = channelTypeMouseCooldown || [];
    if (array.length === params.cooldownUI.limit) {
        array.shift();
    }
    array.push(DateNow);

    // Save the array scheduled timestamp for the type and the channel.
    setChannelActionCooldown(channelId, array, params.mouseType);
};
