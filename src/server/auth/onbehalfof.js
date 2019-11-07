const request = require('request-promise-native');

let config;

const init = oidcConfig => {
    config = oidcConfig;
};

const hentFor = async (clientId, speilAccessToken) => {
    const options = {
        uri: `${config.providerBaseUrl}/token`,
        json: true,
        postData: {
            mimeType: 'application/x-www-form-urlencoded',
            params: [
                { name: 'grant_type', value: 'urn:ietf:params:oauth:grant-type:jwt-bearer' },
                { name: 'client_id', value: config.clientID }, // our own
                { name: 'client_secret', value: config.clientSecret },
                { name: 'assertion', value: speilAccessToken },
                { name: 'scope', value: `${clientId}/.default` }, // the app we're reaching out to
                { name: 'requested_token_use', value: 'on_behalf_of' }
            ]
        }
    };
    const response = await request.post(options);
    return response.access_token;
};

module.exports = {
    init
};
