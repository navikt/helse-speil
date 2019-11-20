'use strict';

const personinfomapping = require('./personinfomapping');

let sparkelClient;
let stsClient;
let aktørIdLookup;

const init = ({ stsclient, sparkelclient, aktørIdLookup: aktøridlookup }) => {
    stsClient = stsclient;
    sparkelClient = sparkelclient;
    aktørIdLookup = aktøridlookup;
};

const hentPersoninfo = async aktørId => {
    return stsClient
        .hentAccessToken()
        .then(token => sparkelClient.hentPersoninfo(aktørId, token))
        .then(async person => {
            const fnr = await aktørIdLookup.hentFnr(aktørId);
            return personinfomapping.map({ ...person, fnr });
        });
};
module.exports = {
    init,
    hentPersoninfo
};
