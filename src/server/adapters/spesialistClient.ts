import request from 'request-promise-native';
import { Oppgave } from '../../types';

export interface SpadeResponse {
    statusCode: number;
    body: Oppgave;
}

export interface SpesialistClient {
    behandlingerForPeriode: (fom: string, tom: string, accessToken: string) => Promise<SpadeResponse>;
}

export const spesialistClient: SpesialistClient = {
    behandlingerForPeriode: (fom, tom, accessToken) => {
        const options = {
            uri: `http://spesialist/api/oppgaver`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            resolveWithFullResponse: true
        };
        return request.get(options);
    }
};

export default spesialistClient;
