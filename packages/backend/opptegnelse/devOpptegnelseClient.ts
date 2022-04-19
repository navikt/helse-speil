import { OpptegnelseClient } from './opptegnelseClient';

const opptegnelse = {
    aktørId: 12341234,
    sekvensnummer: 12121212,
    type: 'UTBETALING_ANNULLERING_OK',
    payload: 'payload',
};

const opptegnelse2 = {
    aktørId: 1000000009871,
    sekvensnummer: 12121213,
    type: 'UTBETALING_ANNULLERING_FEILET',
    payload: 'payload2',
};

const opptegnelse3 = {
    aktørId: 1000000009871,
    sekvensnummer: 12121214,
    type: 'NY_SAKSBEHANDLEROPPGAVE',
    payload: 'payload3',
};

let svarPåOpptegnelser = true;
const blokkerSvarPåOpptegnelser = () => {
    svarPåOpptegnelser = false;
    setTimeout(() => {
        svarPåOpptegnelser = true;
    }, 5000);
};

const devOpptegnelseClient: OpptegnelseClient = {
    abonnerPåAktør: async (): Promise<any> => {
        blokkerSvarPåOpptegnelser();
        return;
    },
    getAlleOpptegnelser: async (): Promise<any> => Promise.resolve({ status: 200, body: [opptegnelse, opptegnelse2] }),
    getOpptegnelser: async (speilToken: string, sisteSekvensId: number): Promise<any> => {
        return svarPåOpptegnelser
            ? Promise.resolve(
                  Math.random() < 0.05
                      ? {
                            status: 200,
                            body: [{ ...opptegnelse3, type: 'REVURDERING_AVVIST' }].filter(
                                (it) => it.sekvensnummer > sisteSekvensId
                            ),
                        }
                      : {
                            status: 200,
                            body: [{ ...opptegnelse3 }].filter((it) => it.sekvensnummer > sisteSekvensId),
                        }
              )
            : Promise.resolve({ status: 200, body: [] });
    },
};

export default devOpptegnelseClient;
