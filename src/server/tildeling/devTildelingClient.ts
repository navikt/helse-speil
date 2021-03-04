import request from 'request-promise-native';
import { sleep } from '../devHelpers';
import { Tildeling } from './tildelingClient';

const passeLenge = () => Math.random() * 500 + 200;

export default {
    postTildeling: async (tildeling: Tildeling): Promise<any> =>
        sleep(passeLenge()).then(() => {
            Math.random() < 1
                ? request.post(`http://localhost:9001/api/tildeling/${tildeling.oppgavereferanse}`)
                : Promise.reject({
                      feilkode: 409,
                      kildesystem: 'mockSpesialist',
                      kontekst: {
                          tildeltTil: 'Saksbehandler Frank',
                      },
                  });
        }),
    fjernTildeling: async (tildeling: Tildeling): Promise<any> =>
        sleep(passeLenge()).then(() => {
            Math.random() < 1
                ? request.delete(`http://localhost:9001/api/tildeling/${tildeling.oppgavereferanse}`)
                : Promise.reject();
        }),
};
