const { getUserCooldown, setUserCooldown } = require('../../../config/state');
const { CONFIG } = require('../../../config/constants');

/**
 *  Bot abuse prevention:  don't allow a user to spam.
 */

module.exports.userIsInCooldown = function (opaqueUserId, type) {
    // Check if the user is in cool-down.
    const cooldown = getUserCooldown(opaqueUserId, type);
    const now = Date.now();
    if (cooldown && cooldown > now) {
        return true;
    }
    // Voting extensions must also track per-user votes to prevent skew.
    // Check what type it is
    if (type === 'action') {
        setUserCooldown(opaqueUserId, now + CONFIG.userActionCooldownMs, type);
    } else {
        setUserCooldown(opaqueUserId, now + CONFIG.userMouseEventCooldownMs, type);
    }
    return false;
};
