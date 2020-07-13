import request from 'request-promise-native';

export interface SpesialistClient {
    behandlingerForPeriode: (onBehalfOfToken: string) => Promise<Response>;
    hentPersonByAktørId: (aktørId: string, onBehalfOfToken: string) => Promise<Response>;
    hentPersonByFødselsnummer: (fødselsnummer: string, onBehalfOfToken: string) => Promise<Response>;
}

export const spesialistClient: SpesialistClient = {
    behandlingerForPeriode: async (onBehalfOfToken): Promise<Response> => {
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/oppgaver`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.get(options).then((res) =>
            Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response)
        );
    },

    hentPersonByAktørId: async (aktørId, onBehalfOfToken): Promise<Response> => {
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/person/aktorId/${aktørId}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.get(options).then((res) =>
            Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response)
        );
    },

    hentPersonByFødselsnummer: async (fødselsnummer, onBehalfOfToken): Promise<Response> => {
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/person/fnr/${fødselsnummer}`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.get(options).then((res) =>
            Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response)
        );
    },
};

export default spesialistClient;
