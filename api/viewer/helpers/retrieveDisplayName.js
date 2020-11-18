const apiTwitch = require('../../../twitch/api');
const { getTwitchUserObject, setTwitchUserObject } = require('../../../config/state');
const { API_TWITCH } = require('../../../config/constants');

/**
 * Request and/or get display name if authorized by the user
 */
module.exports.retrieveDisplayName = async function (verifiedJWT) {
    const { opaque_user_id: opaqueUserId, user_id: userId } = verifiedJWT;

    // Verify if we have already retrieve user object
    const userObject = getTwitchUserObject(opaqueUserId);
    if (userObject && userObject.display_name) {
        return userObject.display_name;
    }

    // Retrieve user object if user has given his authorization
    if (userId) {
        const params = {
            id: userId,
        };
        try {
            const body = await apiTwitch.retrieveUserObject(params);
            if (body.data && body.data.length) {
                const twitchUserObject = body.data[0];
                setTwitchUserObject(opaqueUserId, twitchUserObject);
                if (twitchUserObject.display_name) {
                    return twitchUserObject.display_name;
                }
            }
        } catch (err) {
            verboseLog(API_TWITCH.retrieveUserObjectError, query.id);
            return null;
        }
    }
    return null;
};
