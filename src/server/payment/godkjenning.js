'use strict';

const request = require('request-promise-native');

const godkjenn = async ({ behovId, aktørId, saksbehandler, accessToken }) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/godkjenning`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: { behovId, aktørId, saksbehandler },
        json: true
    };

    return request.post(options);
};

module.exports = {
    godkjenn
};
