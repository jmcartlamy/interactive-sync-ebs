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
    userActionInCooldown: 'You have pushed this action recently, please wait.',
    userInCooldown: 'You trying to bypass the cooldown. Shame.',
    actionViewErroned: "Parameter view is erroned. Must be 'mobile', 'panel' or 'video_overlay'",
    actionIdErroned: "This ID doesn't exist in the user interface.",
    newMouseEvent: 'New %s for c:%s on behalf of u:%s with coord %s',
    mouseTypeErroned: "Parameter type is erroned. Must be 'mousedown' or 'mouseup'",
    mouseTypeInCooldown: 'Mouse event has reached the limit, please wait.',
    userMouseTypeInCooldown: 'You have pushed this mouse event recently, please wait.',
    sendUserInterface: 'Sending user interface %s to u:%s',
};
module.exports = {
    ACTIONS_TYPE: ACTIONS_TYPE,
    STRINGS: STRINGS,
};
