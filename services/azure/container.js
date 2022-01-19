const request = require('request');

const { AZURE } = require('../../config/constants');
const { verboseLog } = require('../../config/log');
const { blacklistUri } = require('../../config/env');

const retrieveBlacklist = function () {
    // Set the HTTP headers
    const headers = {
        'Content-Type': 'application/json',
    };

    return new Promise(function (resolve, reject) {
        request(
            blacklistUri,
            {
                method: 'GET',
                headers,
            },
            (err, res) => {
                if (err) {
                    verboseLog(AZURE.retrieveBlacklistError, err);
                    reject(err);
                } else {
                    const response = res.toJSON();
                    try {
                        const body = JSON.parse(response.body);
                        verboseLog(AZURE.retrieveBlacklistSuccess, res.statusCode);
                        resolve(body);
                    } catch (err) {
                        verboseLog(AZURE.retrieveBlacklistError, err);
                        reject(err);
                    }
                }
            }
        );
    });
};

module.exports = {
    retrieveBlacklist: retrieveBlacklist,
};
