const { getChannelActionCooldown, setChannelActionCooldown } = require('../../../config/state');
const { ACTIONS_TYPE } = require('../../constants');

/**
 * Limit click per second for mouse event
 */
module.exports.mouseActionLimitIsReached = function (channelId, limit) {
    const mouseCooldown = getChannelActionCooldown(channelId, ACTIONS_TYPE.mouse);
    const array = mouseCooldown ? mouseCooldown : [];
    const now = Date.now();
    if (array.length === limit) {
        if (array[0] + 1000 < now) {
            array.shift();
        } else {
            return true;
        }
    }
    array.push(now);

    // Save the array scheduled timestamp for the type and the channel.
    setChannelActionCooldown(channelId, array, ACTIONS_TYPE.mouse);

    return false;
};
