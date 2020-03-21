import request from 'request-promise-native';

export interface SpleisClient {
    hentPerson: (aktørId: string, onBehalfOfToken: string) => Promise<Response>;
    hentSakByUtbetalingsref: (utbetalingsref: string, onBehalfOfToken: string) => Promise<Response>;
}

const hentPersonByAktørId = async (aktørId: string, onBehalfOfToken: string) => {
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

const hentSakByUtbetalingsref = async (utbetalingsref: string, onBehalfOfToken: string) => {
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

const filename = (aktørId: string) => {
    switch (aktørId) {
        case '1000000009871':
            return 'mock-person_til-godkjenning.json';
        case '87654321962123':
            return 'mock-person_2perioder.json';
        default:
            return 'mock-person_3perioder_første_periode_kort.json';
    }
};

const spleisClient: SpleisClient = {
    hentPerson: hentPersonByAktørId,
    hentSakByUtbetalingsref
};

export default spleisClient;
