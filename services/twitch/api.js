const request = require('request');

const { makeServerToken } = require('./helpers/makeServerToken');
const { getAccessToken } = require('./token');
const { CONFIG, API_TWITCH } = require('../../config/constants');
const { clientId, host } = require('../../config/env');
const { verboseLog } = require('../../config/log');

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
                    verboseLog(API_TWITCH.pubsubResponse, message.type, channelId, res.statusCode);
                    resolve();
                }
            }
        );
    });
};

const validateAccessToken = function (_headers = {}) {
    verboseLog(API_TWITCH.validateAccessTokenRequest);
    // Set the headers required by the Twitch API.
    const headers = {
        Authorization: CONFIG.oauthPrefix + _headers.token || getAccessToken(),
    };

    return new Promise(function (resolve, reject) {
        request(
            `https://id.twitch.tv/oauth2/validate`,
            {
                headers,
            },
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const response = res.toJSON();
                        const body = JSON.parse(response.body);
                        resolve(body);
                    } catch (err) {
                        reject(err);
                    }
                }
            }
        );
    });
};

const retrieveUserObject = function (query, _headers = {}) {
    verboseLog(API_TWITCH.retrieveUserObjectRequest, query.id);
    // Set the headers required by the Twitch API.
    const headers = {
        'Client-ID': _headers.clientId || clientId,
        Authorization: CONFIG.bearerPrefix + (_headers.token || getAccessToken()),
    };

    return new Promise(function (resolve, reject) {
        request(
            `https://api.twitch.tv/helix/users?id=${query.id}`,
            {
                method: 'GET',
                headers,
            },
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const response = res.toJSON();
                        const body = JSON.parse(response.body);
                        resolve(body);
                    } catch (err) {
                        reject(err);
                    }
                }
            }
        );
    });
};

const searchChannels = function (query, _headers = {}) {
    verboseLog(API_TWITCH.searchChannelRequest, query);
    // Set the headers required by the Twitch API.
    const headers = {
        'Client-ID': _headers.clientId || clientId,
        Authorization: CONFIG.bearerPrefix + _headers.token || getAccessToken(),
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
                    reject(err);
                } else {
                    try {
                        const response = res.toJSON();
                        const body = JSON.parse(response.body);
                        resolve(body);
                    } catch (err) {
                        reject(err);
                    }
                }
            }
        );
    });
};

const setExtensionConfiguration = function (channelId, _headers = {}) {
    verboseLog(API_TWITCH.setExtensionConfigurationRequest, channelId);

    // Set the headers required by the Twitch API.
    const headers = {
        'Client-ID': clientId,
        'Content-Type': 'application/json',
        Authorization: CONFIG.bearerPrefix + makeServerToken(channelId),
    };

    // Create the body for the Twitch API request.
    const body = JSON.stringify({
        channel_id: channelId,
        segment: 'broadcaster',
        content: JSON.stringify({ host }),
    });

    return new Promise(function (resolve, reject) {
        request(
            `https://api.twitch.tv/extensions/${clientId}/configurations`,
            {
                method: 'PUT',
                headers,
                body,
            },
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    const response = res.toJSON();
                    try {
                        const body = response.body ? JSON.parse(response.body) : response;
                        resolve(body);
                    } catch (err) {
                        resolve(response);
                    }
                }
            }
        );
    });
};

module.exports = {
    sendBroadcastMessage: sendBroadcastMessage,
    validateAccessToken: validateAccessToken,
    retrieveUserObject: retrieveUserObject,
    searchChannels: searchChannels,
    setExtensionConfiguration: setExtensionConfiguration,
};
