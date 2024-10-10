import { Opptegnelse } from '../opptegnelser';

export const opptegnelser: Opptegnelse[] = [
    {
        aktorId: 1234567891011,
        sekvensnummer: 12121212,
        type: 'UTBETALING_ANNULLERING_OK',
        payload: 'payload',
    },
    {
        aktorId: 2568043185108,
        sekvensnummer: 12121213,
        type: 'PERSONDATA_OPPDATERT',
        payload: 'payload2',
    },
    {
        aktorId: 2568043185108,
        sekvensnummer: 12121214,
        type: 'NY_SAKSBEHANDLEROPPGAVE',
        payload: 'payload3',
    },
];
