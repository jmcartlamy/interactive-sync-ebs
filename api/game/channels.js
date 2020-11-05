const Boom = require('@hapi/boom');
const apiTwitch = require('../../twitch/api');

/**
 * Call API Twitch to search channels
 */
const searchChannelHandler = async function (req) {
    // TODO verify request JWT

    if (!req.params || !req.params.user) {
        throw Boom.badRequest(STRINGS.searchChannelBadRequest);
    }

    try {
        const body = await apiTwitch.searchChannels(req.params.user);
        if (body.data && body.data.length) {
            channelId = body.data[0].id;
        }
        return {
            channelId: channelId.toString(),
        };
    } catch (err) {}

    return null;
};

module.exports = {
    searchChannelHandler: searchChannelHandler,
};
