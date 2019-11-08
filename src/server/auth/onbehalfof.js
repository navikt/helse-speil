const request = require('request-promise-native');

let config;

const factory = oidcConfig => {
    config = oidcConfig;
    return {
        hentFor
    };
};

const hentFor = async (clientId, spadeAccessToken) => {
    if (process.env.NODE_ENV === 'development') return '';
    const options = {
        uri: `${config.providerBaseUrl}/oauth2/v2.0/token`,
        json: true,
        postData: {
            mimeType: 'application/x-www-form-urlencoded',
            params: [
                { name: 'grant_type', value: 'urn:ietf:params:oauth:grant-type:jwt-bearer' },
                { name: 'client_id', value: config.clientID }, // our own
                { name: 'client_secret', value: config.clientSecret },
                { name: 'assertion', value: spadeAccessToken },
                { name: 'scope', value: `${clientId}/.default` }, // the app we're reaching out to
                { name: 'requested_token_use', value: 'on_behalf_of' }
            ]
        }
    };
    const response = await request.post(options);
    return response.access_token;
};

module.exports = {
    factory
};
