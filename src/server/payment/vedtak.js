'use strict';

const request = require('request-promise-native');

const vedtak = async ({ behovId, aktørId, saksbehandlerIdent, godkjent, accessToken }) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/vedtak`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: { behovId, aktørId, saksbehandlerIdent, godkjent },
        json: true
    };

    return request.post(options);
};

module.exports = {
    vedtak: vedtak
};
