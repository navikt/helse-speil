const request = require('request-promise-native');
const fs = require('fs');

const hentPerson = async (aktørId, onBehalfOfToken) => {
    if (process.env.NODE_ENV === 'development') {
        const fromFile = fs.readFileSync('__mock-data__/tidslinjeperson.json', 'utf-8');
        const person = JSON.parse(fromFile);
        return Promise.resolve({
            statusCode: 200,
            body: person
        });
    }
    const options = {
        uri: `http://spleis.default.svc.nais.local/api/person/${aktørId}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`
        },
        resolveWithFullResponse: true,
        json: true
    };
    return request.get(options);
};

module.exports = {
    hentPerson
};
