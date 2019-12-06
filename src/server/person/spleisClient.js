const request = require('request-promise-native');
const fs = require('fs');

const hentSak = async (aktørId, onBehalfOfToken) => {
    if (process.env.NODE_ENV === 'development') {
        const fromFile = fs.readFileSync(`__mock-data__/${filename(aktørId)}`, 'utf-8');
        const person = JSON.parse(fromFile);
        return Promise.resolve({
            statusCode: 200,
            body: person
        });
    }
    const options = {
        uri: `http://spleis.default.svc.nais.local/api/sak/${aktørId}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`
        },
        resolveWithFullResponse: true,
        json: true
    };
    return request.get(options);
};

const hentSakByUtbetalingsref = async (utbetalingsref, onBehalfOfToken) => {
    if (process.env.NODE_ENV === 'development') {
        const fromFile = fs.readFileSync(`__mock-data__/mock-sak-2.json`, 'utf-8');
        const person = JSON.parse(fromFile);
        return Promise.resolve({
            statusCode: 200,
            body: person
        });
    }
    const options = {
        uri: `http://spleis.default.svc.nais.local/api/utbetaling/${utbetalingsref}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`
        },
        resolveWithFullResponse: true,
        json: true
    };
    return request.get(options);
};

const filename = aktørId =>
    aktørId === '0123456789012' || !/[a-z]/.test(aktørId) ? 'mock-sak-1.json' : 'mock-sak-2.json';

module.exports = {
    hentSak,
    hentSakByUtbetalingsref
};
