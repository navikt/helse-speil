import request from 'request-promise-native';
import { NotatDTO } from '../types';

export default {
    leggPåVent: async (speilToken: string, oppgavereferanse: string, notat: NotatDTO): Promise<any> =>
        request.post(`http://localhost:9001/api/leggpaavent/${oppgavereferanse}`, { body: notat }),

    fjernPåVent: async (speilToken: string, oppgavereferanse: string): Promise<any> =>
        request.delete(`http://localhost:9001/api/leggpaavent/${oppgavereferanse}`),
};
