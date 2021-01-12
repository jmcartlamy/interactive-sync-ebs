const ACTIONS_TYPE = {
    input: 'input',
    mouse: 'mouse',
};

const STRINGS = {
    cooldownChannel: 'Too many users use mouse event, please wait.',
    newAction: 'New action for c:%s on behalf of u:%s',
    sendAction: 'Sending actions %s to u:%s',
    actionBroadcast: 'Broadcasting action %s with value %s for c:%s',
    actionInCooldown: 'Action has been pushed recently, please wait.',
    userActionInCooldown: 'You have pushed an action recently, please wait.',
    userInCooldown: 'You trying to bypass the cooldown. Shame.',
    actionViewErroned: "Parameter view is erroned. Must be 'mobile', 'panel_' or 'video_overlay'",
    actionIdErroned: "This ID doesn't exist in the user interface.",
    newMouseEvent: 'New %s for c:%s on behalf of u:%s with coord %s',
    sendUserInterface: 'Sending user interface %s to u:%s',
};
module.exports = {
    ACTIONS_TYPE: ACTIONS_TYPE,
    STRINGS: STRINGS,
};
