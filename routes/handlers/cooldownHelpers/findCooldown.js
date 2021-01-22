const { getUserInterface } = require('../../../db/state');

const findCooldownByViewAndActionId = function (view, channelId, actionId) {
    const userInterface = getUserInterface(channelId);
    let cooldown = null;

    if (view && userInterface) {
        if (view === 'video_overlay') {
            for (const key in userInterface.video_overlay) {
                if (!cooldown) {
                    cooldown = _findCooldown(actionId, userInterface.video_overlay[key]);
                }
            }
        }
        if (view === 'panel') {
            cooldown = _findCooldown(actionId, userInterface.panel);
        }
        if (view === 'mobile') {
            cooldown = _findCooldown(actionId, userInterface.mobile);
        }
    }
    return cooldown;
};

const _findCooldown = function (actionId, userInterfaceView) {
    if (userInterfaceView.components && userInterfaceView.components.length !== 0) {
        const result = userInterfaceView.components.find(function (item) {
            return (
                item.name === actionId &&
                item.cooldown &&
                item.cooldown.duration &&
                typeof item.cooldown.duration === 'number'
            );
        });
        if (result) {
            return result.cooldown || null;
        }
    }
    return null;
};

const findCooldownByMouseType = function (channelId, mouseType) {
    const userInterface = getUserInterface(channelId);
    let cooldown = null;

    if (userInterface && userInterface.video_overlay && userInterface.video_overlay.mouse) {
        const result = userInterface.video_overlay.mouse.find(function (item) {
            return item.type === mouseType && item.cooldown;
        });
        if (result && result.cooldown) {
            return result.cooldown;
        }
    }
    return cooldown;
};

module.exports = {
    findCooldownByViewAndActionId: findCooldownByViewAndActionId,
    findCooldownByMouseType: findCooldownByMouseType,
};
