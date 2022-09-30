import request from 'request-promise-native';

import { NotatDTO } from '../types';

export default {
    postNotat: async (speilToken: string, vedtaksperiodeId: string, notat: NotatDTO): Promise<any> => {
        const options = {
            uri: `http://localhost:9001/api/notater/${vedtaksperiodeId}`,
            body: JSON.stringify(notat),
            resolveWithFullResponse: true,
            json: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        return request.post(options);
    },
    feilregistrerNotat: async (speilToken: string, vedtaksperiodeId: string, notatId: string): Promise<any> => {
        const options = {
            uri: `http://localhost:9001/api/notater/${vedtaksperiodeId}/feilregistrer/${notatId}`,
            resolveWithFullResponse: true,
            json: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        return request.put(options);
    },
    getNotat: async (speilToken: string, vedtaksperiodeIder: string): Promise<any> => {
        const options = {
            uri: `http://localhost:9001/api/notater?${vedtaksperiodeIder}`,
            resolveWithFullResponse: true,
            json: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        return request.get(options);
    },
};
