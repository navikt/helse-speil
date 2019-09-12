'use strict';

const request = require('request-promise-native');

let stsclient = null;

const init = stsClient => {
    stsclient = stsClient;
};

const hentPerson = async aktørId =>
    stsclient.hentAccessToken().then(token => {
        const options = {
            uri: `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        };

        return request.get(options);
    });

module.exports = {
    init: init,
    hentPerson: hentPerson
};
