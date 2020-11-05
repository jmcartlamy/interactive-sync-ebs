const jsonwebtoken = require('jsonwebtoken');
const { CONFIG } = require('../../config/constants');
const { ownerId, secret } = require('../../config/env');

/**
 * Create and return a JWT for use by this service.
 */
module.exports.makeServerToken = function (channelId) {
    const payload = {
        exp: Math.floor(Date.now() / 1000) + CONFIG.serverTokenDurationSec,
        channel_id: channelId,
        user_id: ownerId, // extension owner ID for the call to Twitch PubSub
        role: 'external',
        pubsub_perms: {
            send: ['*'],
        },
    };
    return jsonwebtoken.sign(payload, secret, { algorithm: 'HS256' });
};
