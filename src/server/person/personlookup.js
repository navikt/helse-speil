'use strict';

const request = require('request-promise-native');
const aktøridlookup = require('../aktørid/aktøridlookup');

let stsClient = null;

const init = stsclient => {
    stsClient = stsclient;
};

const hentPerson = async aktørId =>
    stsClient
        .hentAccessToken()
        .then(token => {
            const options = {
                uri: `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                json: true
            };

            return request.get(options);
        })
        .then(async person => {
            const fnr = await aktøridlookup.hentFnr(aktørId);
            return { ...person, fnr };
        });

module.exports = {
    init: init,
    hentPerson: hentPerson
};
