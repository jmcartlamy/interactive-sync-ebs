const { setUserCooldown, setUserActionCooldown } = require('../../../db/state');
const { CONFIG } = require('../../../config/constants');
const { ACTIONS_TYPE } = require('../../constants');

/**
 *  Register user cooldowns for the current user
 */

module.exports.registerUserCooldowns = function (opaqueUserId, params) {
    const { actionId, type, cooldownUI, DateNow } = params;

    // Check what type it is
    if (type === ACTIONS_TYPE.input) {
        setUserCooldown(opaqueUserId, DateNow + CONFIG.userInputEventCooldownMs, type);
    } else if (type === ACTIONS_TYPE.mouse) {
        setUserCooldown(opaqueUserId, DateNow + CONFIG.userMouseEventCooldownMs, type);
    }
    // Must also track per-user action to prevent skew.
    setUserActionCooldown(opaqueUserId, DateNow + cooldownUI.duration, actionId);
};
