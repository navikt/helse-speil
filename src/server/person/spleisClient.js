const request = require('request-promise-native');

const hentPerson = async (aktørId, onBehalfOfToken) => {
    const options = {
        uri: `spleis.default.svc.nais.local/api/person?aktørId=${aktørId}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`
        },
        json: true
    };
    return request.get(options);
};

module.exports = {
    hentPerson
};
