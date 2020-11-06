const jsonwebtoken = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const { secret } = require('../../config/env');
const { CONFIG, API_TWITCH } = require('../../config/constants');

/**
 * Verify the header and the enclosed JWT.
 */
module.exports.verifyAndDecode = function (header) {
    if (header && header.startsWith(CONFIG.bearerPrefix)) {
        try {
            const token = header.substring(CONFIG.bearerPrefix.length);
            return jsonwebtoken.verify(token, secret, { algorithms: ['HS256'] });
        } catch (ex) {
            throw Boom.unauthorized(API_TWITCH.invalidJwt);
        }
    }
    throw Boom.unauthorized(API_TWITCH.invalidAuthHeader);
};
