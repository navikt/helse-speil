const authSupport = require('./authsupport');
const request = require('request-promise-native');

let cachedAccessToken;
let authConfig;

const init = navConfig => {
    authConfig = navConfig;
    hentAccessToken().catch(err => {
        console.error(`Error during STS login: ${err}`);
    });
};

const hentAccessToken = async () => {
    if (!tokenNeedsRefresh()) {
        return Promise.resolve(cachedAccessToken);
    }

    const options = {
        uri: `${authConfig.stsUrl}/rest/v1/sts/token?grant_type=client_credentials&scope=openid`,
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(
                    `${authConfig.serviceUserName}:${authConfig.serviceUserPassword}`
                ).toString('base64')
        },
        json: true
    };
    const response = await request.get(options);
    cachedAccessToken = response.access_token;

    return cachedAccessToken;
};

const tokenNeedsRefresh = () => {
    return !cachedAccessToken || authSupport.willExpireInLessThan(30, cachedAccessToken);
};

module.exports = {
    init,
    hentAccessToken
};
