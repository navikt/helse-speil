'use strict';

const request = require('request-promise-native');

const godkjenn = async (behovsId, aktørId, accessToken) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/godkjenning`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: { behovsId, aktørId },
        json: true
    };

    return request.post(options);
};

module.exports = {
    godkjenn
};
