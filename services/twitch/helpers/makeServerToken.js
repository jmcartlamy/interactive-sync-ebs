const jsonwebtoken = require('jsonwebtoken');
const { CONFIG } = require('../../../config/constants');
const { secret } = require('../../../config/env');

/**
 * Create and return a JWT for use by this service.
 */
module.exports.makeServerToken = function (channelId) {
    const payload = {
        exp: Math.floor(Date.now() / 1000) + CONFIG.serverTokenDurationSec,
        channel_id: channelId,
        user_id: channelId,
        role: 'external',
        pubsub_perms: {
            send: ['*'],
        },
    };
    return jsonwebtoken.sign(payload, secret, { algorithm: 'HS256' });
};
