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
        aktorId: '2564094783926',
        sekvensnummer: 12121213,
        type: Opptegnelsetype.PersondataOppdatert,
        payload: 'payload2',
        __typename: 'Opptegnelse',
    },
    {
        aktorId: '2564094783926',
        sekvensnummer: 12121214,
        type: Opptegnelsetype.NySaksbehandleroppgave,
        payload: 'payload3',
        __typename: 'Opptegnelse',
    },
    {
        aktorId: '1000000000004',
        sekvensnummer: 12121215,
        type: Opptegnelsetype.PersonKlarTilBehandling,
        payload: 'payload4',
        __typename: 'Opptegnelse',
    },
];
