'use strict';

let sparkelClient;
let stsClient;
let aktørIdLookup;

const init = ({ stsclient, sparkelclient, aktørIdLookup: aktøridlookup }) => {
    stsClient = stsclient;
    sparkelClient = sparkelclient;
    aktørIdLookup = aktøridlookup;
};

const hentPerson = async aktørId => {
    return stsClient
        .hentAccessToken()
        .then(token => sparkelClient.hentPerson(aktørId, token))
        .then(async person => {
            const fnr = await aktørIdLookup.hentFnr(aktørId);
            return { ...person, fnr };
        });
};
module.exports = {
    init: init,
    hentPerson: hentPerson
};
