const color = require("color");

const ACTIONS = {
    initialTestColor: color('#6441A4'),
};

const STRINGS = {
    cyclingColor: 'Cycling test color for c:%s on behalf of u:%s',
    colorBroadcast: 'Broadcasting test color %s for c:%s',
    sendColor: 'Sending color %s to u:%s',
    cooldown: 'Please wait before clicking again',
    newAction: 'New action for c:%s on behalf of u:%s',
    sendAction: 'Sending actions %s to u:%s',
    actionBroadcast: 'Broadcasting action %s with value %s for c:%s',
    actionInCooldown: 'Action has been pushed recently, please wait.',
    newMouseEvent: 'New %s for c:%s on behalf of u:%s with coord %s',
    sendUserInterface: 'Sending user interface %s to u:%s',
};
module.exports = {
    ACTIONS: ACTIONS,
    STRINGS: STRINGS,
};