/**
 * Find cooldown on user interface by action id
 */
module.exports.findCooldownByActionId = function (actionId, userInterface) {
    let cooldown = null;
    if (userInterface.video_overlay) {
        cooldown = _findCooldownByActionId(actionId, userInterface.video_overlay);
    }
    if (userInterface.panel) {
        cooldown = _findCooldownByActionId(actionId, userInterface.panel);
    }
    return cooldown;
};

const _findCooldownByActionId = function (actionId, userInterfaceType) {
    if (userInterfaceType.components && userInterfaceType.components.length !== 0) {
        const result = userInterfaceType.components.find(function (item) {
            return item.name === actionId && item.cooldown && typeof item.cooldown === 'number';
        });
        if (result) {
            return result.cooldown || null;
        }
    }
    return null;
};
