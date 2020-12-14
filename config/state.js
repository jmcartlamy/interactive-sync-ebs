const twitchUserObject = {};
const channelAction = {};
const channelUserInterface = {};
const channelCooldowns = {};    // rate limit compliance
const userCooldowns = {};       // spam prevention

module.exports = {
    getTwitchUserObject: function (opaqueUserId) {
        if (!twitchUserObject[opaqueUserId]) {
            twitchUserObject[opaqueUserId] = null;
        }
        return twitchUserObject[opaqueUserId];
    },
    setTwitchUserObject: function (opaqueUserId, object) {
        twitchUserObject[opaqueUserId] = object;
    },
    getChannelAllActions: function (channelId) {
        if (!channelAction[channelId]) {
            channelAction[channelId] = {};
        }
        return channelAction[channelId];
    },

    getChannelAction: function (channelId, type) {
        if (!channelAction[channelId]) {
            channelAction[channelId] = {};
        }
        return channelAction[channelId][type];
    },

    setChannelAction: function (channelId, scheduledTimestamp, type) {
        channelAction[channelId][type] = scheduledTimestamp;
    },

    getUserInterface: function (channelId) {
        return channelUserInterface[channelId];
    },

    setUserInterface: function (channelId, userInterface) {
        channelUserInterface[channelId] = userInterface;
    },

    getChannelCooldown: function (channelId) {
        return channelCooldowns[channelId];
    },

    setChannelCooldown: function (channelId, cooldown) {
        channelCooldowns[channelId] = cooldown;
    },

    getUserCooldown: function (opaqueUserId, type) {
        if (!userCooldowns[opaqueUserId]) {
            userCooldowns[opaqueUserId] = {};
        }
        return userCooldowns[opaqueUserId][type];
    },

    setUserCooldown: function (opaqueUserId, cooldown, type) {
        userCooldowns[opaqueUserId][type] = cooldown;
    },
};

// TODO protect undefined of variable (set)