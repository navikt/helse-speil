'use strict';

const request = require('request-promise-native');

const behandlingerFor = (aktorId, accessToken) =>
    new Promise((resolve, reject) => {
        const options = {
            uri: `http://spade.default.svc.nais.local/api/behandlinger/${aktorId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            resolveWithFullResponse: true
        };

        request
            .get(options)
            .then(response => {
                resolve({
                    status: response.statusCode,
                    behandlinger: response.data
                });
            })
            .catch(err => {
                reject(err);
            });
    });

module.exports = {
    behandlingerFor: behandlingerFor
};
