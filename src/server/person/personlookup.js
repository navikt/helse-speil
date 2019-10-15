'use strict';

const request = require('request-promise-native');

let stsClient = null;
let aktørIdLookup;

const init = (stsclient, aktøridlookup) => {
    stsClient = stsclient;
    aktørIdLookup = aktøridlookup;
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
            const fnr = await aktørIdLookup.hentFnr(aktørId);
            return { ...person, fnr };
        });

module.exports = {
    init: init,
    hentPerson: hentPerson
};
