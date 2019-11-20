const request = require('request-promise-native');

module.exports = {
    hentPersoninfo: (aktørId, token) => {
        const options = {
            uri: `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        };

        return request.get(options);
    }
};
