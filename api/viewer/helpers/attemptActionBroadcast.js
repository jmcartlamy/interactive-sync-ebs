const apiTwitch = require('../../../twitch/api');
const { getChannelCooldown, setChannelCooldown } = require('../../../config/state');
const { STRINGS } = require('../../constants');
const { CONFIG } = require('../../../config/constants');
const { verboseLog } = require('../../../config/log');

const attemptActionBroadcast = async function (channelId, actionCooldown, actionId) {
    // Check the cool-down to determine if it's okay to send now.
    const now = Date.now();
    const cooldown = getChannelCooldown(channelId);
    if (!cooldown || cooldown.time < now) {
        // It is.
        setChannelCooldown(channelId, { time: now + CONFIG.channelCooldownMs });

        // Send to broadcast twitch
        const message = {
            type: 'action',
            data: {
                actionId: actionId,
                actionCooldown: actionCooldown || null,
            },
        };
        try {
            verboseLog(STRINGS.actionBroadcast, actionId, actionCooldown, channelId);
            await apiTwitch.sendBroadcastMessage(channelId, message);
        } catch (err) {
            verboseLog(err);
        }
    } else if (!cooldown.trigger) {
        // It isn't; schedule a delayed broadcast if we haven't already done so.
        cooldown.trigger = setTimeout(
            apiTwitch.sendBroadcastMessage.bind(null, channelId, message),
            now - cooldown.time
        );
    }
};

module.exports = {
    attemptActionBroadcast: attemptActionBroadcast,
};
