'use strict';

const request = require('request-promise-native');

const behandlingerFor = (aktorId, accessToken) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/behandlinger/${aktorId}`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        json: true,
        resolveWithFullResponse: true
    };
    return request.get(options);
};

module.exports = {
    behandlingerFor: behandlingerFor
};
