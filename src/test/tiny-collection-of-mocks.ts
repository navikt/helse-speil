import { FetchPersonDocument, OpprettAbonnementDocument, OpptegnelserDocument } from '@io/graphql';
import { createMock } from '@test-utils';

/*
  Her finner dere helt basic no-op mocks.

  Tenk dere om 1-2 ganger før dere utvider med funksjonalitet for å styre hva mockene returnerer 🤔
  Kanskje er det en god idé, kanskje ikke!
 */

export const opptegnelseMock = createMock({
    request: { query: OpptegnelserDocument, variables: { sekvensId: undefined } },
    result: {
        data: {
            __typename: 'Query',
            opptegnelser: [],
        },
    },
});

export const opprettAbonnementMock = (identifikator: string) =>
    createMock({
        request: { query: OpprettAbonnementDocument, variables: { personidentifikator: identifikator } },
        result: {
            data: {
                __typename: 'Mutation',
                opprettAbonnement: true,
            },
        },
    });

export const fetchPersonMock = createMock({
    request: {
        query: FetchPersonDocument,
        variables: {
            aktorId: '12345678910',
        },
    },
    result: {
        data: {
            __typename: 'Query',
            person: null,
        },
    },
});
