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
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            client_id: config.clientID, // our own
            client_secret: config.clientSecret,
            assertion: spadeAccessToken,
            scope: `${clientId}/.default`, // the app we're reaching out to
            requested_token_use: 'on_behalf_of'
        }
    };
    const response = await request.post(options);
    return response.access_token;
};

module.exports = {
    factory
};
