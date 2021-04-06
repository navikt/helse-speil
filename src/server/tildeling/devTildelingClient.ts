import request from 'request-promise-native';
import { sleep } from '../devHelpers';
import { Tildeling } from './tildelingClient';

const passeLenge = () => Math.random() * 500 + 200;

export default {
    postTildeling: (tildeling: Tildeling): Promise<any> =>
        sleep(passeLenge()).then(() => {
            return Math.random() < 1
                ? request.post(`http://localhost:9001/api/tildeling/${tildeling.oppgavereferanse}`)
                : Promise.reject({
                      feilkode: 409,
                      kildesystem: 'mockSpesialist',
                      kontekst: {
                          tildeling: {
                              navn: 'Saksbehandler Frank',
                              epost: 'frank@nav.no',
                              oid: 'en annen oid',
                          },
                      },
                  });
        }),
    fjernTildeling: (tildeling: Tildeling): Promise<any> =>
        sleep(passeLenge()).then(() => {
            return Math.random() < 1
                ? request.delete(`http://localhost:9001/api/tildeling/${tildeling.oppgavereferanse}`)
                : Promise.reject();
        }),
};
