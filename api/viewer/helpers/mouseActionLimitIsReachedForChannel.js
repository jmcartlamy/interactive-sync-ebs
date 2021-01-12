const { CONFIG } = require('../../../config/constants');
const { getChannelActionCooldown } = require('../../../config/state');
const { registerMouseActionForChannel } = require('./registerMouseActionForChannel');

/**
 * Verify if mouse action limit with type is reached for the channel
 * If false, register limit click per second for mouse event
 */
module.exports.mouseActionLimitIsReachedForChannel = function (channelId, params, DateNow) {
    const channelTypeMouseCooldown = getChannelActionCooldown(channelId, params.mouseType);

    if (
        channelTypeMouseCooldown &&
        channelTypeMouseCooldown.length === params.cooldownUI.limit &&
        channelTypeMouseCooldown[0] + CONFIG.mouseEventCooldownMs > DateNow
    ) {
        return true;
    } else {
        registerMouseActionForChannel(channelId, channelTypeMouseCooldown, params, DateNow);
    }

    return false;
};
