'use strict';

const personinfomapping = require('./personinfomapping');

const build = ({ stsclient, sparkelClient, aktørIdLookup }) => {
    return {
        hentPersoninfo: async aktørId => {
            return stsclient
                .hentAccessToken()
                .then(token => sparkelClient.hentPersoninfo(aktørId, token))
                .then(async person => {
                    const fnr = await aktørIdLookup.hentFnr(aktørId);
                    return personinfomapping.map({ ...person, fnr });
                });
        }
    };
};
module.exports = {
    build
};
