import request from 'request-promise-native';

import { NotatDTO } from '../types';

export default {
    leggPåVent: async (speilToken: string, oppgavereferanse: string, notat: NotatDTO): Promise<any> => {
        const options = {
            uri: `http://localhost:9001/api/leggpaavent/${oppgavereferanse}`,
            body: notat,
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
};
