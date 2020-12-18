const { getChannelAction, setChannelAction } = require('../../../config/state');

/**
 * Limit click per second for mouse event
 */
module.exports.mouseActionLimitIsReached = function (channelId, limit) {
    const mouseCooldown = getChannelAction(channelId, 'mouse');
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
    setChannelAction(channelId, array, 'mouse');

    return false;
};
