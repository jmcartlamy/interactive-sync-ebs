/**
 * Find cooldown on user interface by view and action id
 */
module.exports.findCooldownByViewAndActionId = function (view, actionId, userInterface) {
    let cooldown = null;
    if (view && userInterface) {
        if (view === 'video_overlay') {
            for (const key in userInterface.video_overlay) {
                if (!cooldown) {
                    cooldown = findCooldown(actionId, userInterface.video_overlay[key]);
                }
            }
        }
        if (view === 'panel') {
            cooldown = findCooldown(actionId, userInterface.panel);
        }
        if (view === 'mobile') {
            cooldown = findCooldown(actionId, userInterface.mobile);
        }
    }
    return cooldown;
};

const findCooldown = function (actionId, userInterfaceView) {
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
