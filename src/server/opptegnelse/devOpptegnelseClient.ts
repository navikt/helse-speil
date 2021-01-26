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

export default {
    abonnerPåAktør: async (): Promise<any> => Promise.resolve(),
    getAlleOpptegnelser: async (): Promise<any> => Promise.resolve({ status: 200, body: [opptegnelse] }),
    getOpptegnelser: async (speilToken: string, sisteSekvensId: number): Promise<any> =>
        Promise.resolve({ status: 200, body: [opptegnelse2].filter((it) => it.sekvensnummer > sisteSekvensId) }),
};
