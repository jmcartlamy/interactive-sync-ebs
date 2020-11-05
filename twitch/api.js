const request = require('request');

const { makeServerToken } = require('./helpers/makeServerToken');
const { getAccessToken } = require('./token');
const { CONFIG, API_TWITCH } = require('../config/constants');
const { clientId } = require('../config/env');
const { verboseLog } = require('../config/log');

const sendBroadcastMessage = function (channelId, message) {
    // Set the HTTP headers required by the Twitch API.
    const headers = {
        'Client-ID': clientId,
        'Content-Type': 'application/json',
        Authorization: CONFIG.bearerPrefix + makeServerToken(channelId),
    };

    // Create the POST body for the Twitch API request.
    const body = JSON.stringify({
        content_type: 'application/json',
        message: JSON.stringify(message),
        targets: ['broadcast'],
    });

    return new Promise(function (resolve, reject) {
        request(
            `https://api.twitch.tv/extensions/message/${channelId}`,
            {
                method: 'POST',
                headers,
                body,
            },
            (err, res) => {
                if (err) {
                    verboseLog(API_TWITCH.messageSendError, channelId, err);
                    reject(err);
                } else {
                    verboseLog(API_TWITCH.pubsubResponse, channelId, res.statusCode);
                    resolve();
                }
            }
        );
    });
};

const searchChannels = function (query) {
    verboseLog(API_TWITCH.searchChannelRequest);
    // Set the HTTP headers required by the Twitch API.
    const headers = {
        'Client-ID': clientId,
        Authorization: CONFIG.bearerPrefix + getAccessToken(),
    };

    return new Promise(function (resolve, reject) {
        request(
            `https://api.twitch.tv/helix/search/channels?query=${query}`,
            {
                method: 'GET',
                headers,
            },
            (err, res) => {
                if (err) {
                    verboseLog(API_TWITCH.searchChannelError, err);
                    reject(err);
                } else {
                    const response = res.toJSON();
                    const body = JSON.parse(response.body);

                    verboseLog(API_TWITCH.searchChannelSuccess, res.statusCode);
                    resolve(body);
                }
            }
        );
    });
};

const retrieveUserObject = function (params) {
    // Set the HTTP headers required by the Twitch API.
    const headers = {
        'Client-ID': clientId,
        Authorization: CONFIG.bearerPrefix + getAccessToken(),
    };

    return new Promise(function (resolve, reject) {
        request(
            `https://api.twitch.tv/helix/users?id=${params.id}`,
            {
                method: 'GET',
                headers,
            },
            (err, res) => {
                if (err) {
                    verboseLog(API_TWITCH.retrieveUserObjectError, null);
                    reject(err);
                } else {
                    const response = res.toJSON();
                    const body = JSON.parse(response.body);

                    verboseLog(API_TWITCH.retrieveUserObjectSuccess, res.statusCode);
                    resolve(body);
                }
            }
        );
    });
};

module.exports = {
    sendBroadcastMessage: sendBroadcastMessage,
    searchChannels: searchChannels,
    retrieveUserObject: retrieveUserObject,
};
