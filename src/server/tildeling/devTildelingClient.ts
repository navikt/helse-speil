import request from 'request-promise-native';
import { Tildeling } from './tildelingClient';

export default {
    postTildeling: async (tildeling: Tildeling): Promise<any> =>
        Math.random() < 0.5
            ? request.post(`http://localhost:9001/api/v1/tildeling/${tildeling.oppgavereferanse}`)
            : Promise.reject({
                  feilkode: 409,
                  kildesystem: 'mockSpesialist',
                  kontekst: {
                      tildeltTil: 'Saksbehandler Frank',
                  },
              }),
    fjernTildeling: async (): Promise<any> => (Math.random() < 1 ? Promise.resolve() : Promise.reject()),
};
