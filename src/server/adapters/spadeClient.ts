import request from 'request-promise-native';
import { Oppgave } from '../../types';

export interface SpadeResponse {
    statusCode: number;
    body: Oppgave;
}

export interface SpadeClient {
    behandlingerForPeriode: (fom: string, tom: string, accessToken: string) => Promise<SpadeResponse>;
}

export const spadeClient: SpadeClient = {
    behandlingerForPeriode: (fom, tom, accessToken) => {
        const options = {
            uri: `http://spade.default.svc.nais.local/api/behov/periode?fom=${fom}&tom=${tom}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            resolveWithFullResponse: true
        };
        return request.get(options);
    }
};

export default spadeClient;
