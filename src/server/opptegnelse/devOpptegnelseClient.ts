const opptegnelse = {
    aktørId: '12341234',
    sekvensnummer: '12121212',
    type: 'UTBETALING_ANNULLERING_OK',
    payload: 'payload',
};

export default {
    abonnerPåAktør: async (): Promise<any> => Promise.resolve(),
    getAlleOpptegnelser: async (): Promise<any> => Promise.resolve([opptegnelse]),
    getOpptegnelser: async (): Promise<any> => Promise.resolve([opptegnelse]),
};
