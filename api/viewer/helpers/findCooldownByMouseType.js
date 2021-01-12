// TODO VERIFY USER INTERFACE JSON IN WEBSOCKET

const { getUserInterface } = require('../../../config/state');

module.exports.findCooldownByMouseType = function (channelId, mouseType) {
    const userInterface = getUserInterface(channelId);
    let cooldown = null;

    if (
        userInterface &&
        userInterface.video_overlay &&
        userInterface.video_overlay.mouse &&
        userInterface.video_overlay.mouse.length !== 0
    ) {
        const result = userInterface.video_overlay.mouse.find(function (item) {
            return item.type === mouseType && item.cooldown;
        });
        // TODO REMOVE VERIFICATION HERE
        if (
            result &&
            result.cooldown &&
            result.cooldown.duration &&
            typeof result.cooldown.duration === 'number' &&
            result.cooldown.duration >= 1000 &&
            result.cooldown.duration <= 30000 &&
            result.cooldown.limit &&
            typeof result.cooldown.limit === 'number' &&
            result.cooldown.limit > 0 &&
            result.cooldown.limit <= 10
        ) {
            return result.cooldown;
        }
    }
    return cooldown;
};
