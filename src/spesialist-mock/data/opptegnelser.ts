import { Opptegnelse, Opptegnelsetype } from '@io/graphql';

export const opptegnelser: Opptegnelse[] = [
    {
        aktorId: '1234567891011',
        sekvensnummer: 12121212,
        type: Opptegnelsetype.UtbetalingAnnulleringOk,
        payload: 'payload',
        __typename: 'Opptegnelse',
    },
    {
        aktorId: '2568043185108',
        sekvensnummer: 12121213,
        type: Opptegnelsetype.PersondataOppdatert,
        payload: 'payload2',
        __typename: 'Opptegnelse',
    },
    {
        aktorId: '2568043185108',
        sekvensnummer: 12121214,
        type: Opptegnelsetype.NySaksbehandleroppgave,
        payload: 'payload3',
        __typename: 'Opptegnelse',
    },
];
