const {
    getUserActionCooldown,
    getUserCooldown,
    getChannelActionCooldown,
} = require('../../../db/state');

/**
 *  Bot abuse prevention:  don't allow a user to spam.
 */

const userIsInCooldown = function (opaqueUserId, type, DateNow) {
    // Check if the user is in cooldown.
    const cooldown = getUserCooldown(opaqueUserId, type);
    if (cooldown && cooldown > DateNow) {
        return true;
    }
    return false;
};

/**
 *  Verify user don't bypass the cooldown for this action
 */

const actionIsInCooldownForUser = function (opaqueUserId, actionId, DateNow) {
    // Check if the action of the user is in cooldown.
    const userActionCooldown = getUserActionCooldown(opaqueUserId, actionId);
    if (userActionCooldown && userActionCooldown > DateNow) {
        return true;
    }
    return false;
};

/**
 * Verify if action has been pushed recently if broadcast is activated
 */

const actionIsInCooldownForChannel = function (channelId, actionId, DateNow) {
    const channelActionCooldown = getChannelActionCooldown(channelId, actionId);
    if (channelActionCooldown && channelActionCooldown > DateNow) {
        return true;
    }
    return false;
};

module.exports = {
    userIsInCooldown: userIsInCooldown,
    actionIsInCooldownForUser: actionIsInCooldownForUser,
    actionIsInCooldownForChannel: actionIsInCooldownForChannel,
};
