const tokens = {};

module.exports = {
    getTokens: function () {
        return tokens;
    },

    getAccessToken: function () {
        return tokens.access_token;
    },

    setTokens: function (data) {
        tokens.access_token = data.access_token;
        tokens.expires_in = data.expires_in;
        tokens.token_type = data.token_type;
    },
};
