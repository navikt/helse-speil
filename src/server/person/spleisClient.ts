import request from 'request-promise-native';

export interface SpleisClient {
    hentPerson: (aktørId: string, onBehalfOfToken: string) => Promise<Response>;
    hentSakByUtbetalingsref: (utbetalingsref: string, onBehalfOfToken: string) => Promise<Response>;
}

const hentPersonByAktørId = async (aktørId: string, onBehalfOfToken: string) => {
    const options = {
        uri: `http://spleis-api.default.svc.nais.local/api/person/${aktørId}`,
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
        uri: `http://spleis-api.default.svc.nais.local/api/utbetaling/${utbetalingsref}`,
        headers: {
            Authorization: `Bearer ${onBehalfOfToken}`
        },
        resolveWithFullResponse: true,
        json: true
    };
    return request.get(options);
};

const spleisClient: SpleisClient = {
    hentPerson: hentPersonByAktørId,
    hentSakByUtbetalingsref
};

export default spleisClient;
