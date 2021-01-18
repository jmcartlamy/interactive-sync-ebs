const request = require('request');

const { setTokens } = require('./token');
const { API_TWITCH } = require('../../config/constants');
const { clientId, clientSecret } = require('../../config/env');
const { verboseLog } = require('../../config/log');

const retrieveTokens = function () {
    return new Promise(function (resolve, reject) {
        verboseLog(API_TWITCH.retrieveTokenInit);
        request(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
            {
                method: 'POST',
            },
            (err, res) => {
                if (err) {
                    verboseLog(API_TWITCH.retrieveTokenError, err);
                    reject(err);
                } else {
                    const response = res.toJSON();
                    const body = JSON.parse(response.body);
                    setTokens(body);

                    verboseLog(API_TWITCH.retrieveTokenSuccess, res.statusCode);
                    resolve(body);
                }
            }
        );
    });
};

module.exports = {
    retrieveTokens: retrieveTokens,
};
