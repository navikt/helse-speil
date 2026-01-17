import { FetchPersonDocument } from '@io/graphql';
import { createMock } from '@test-utils';

/*
  Her finner dere helt basic no-op mocks.

  Tenk dere om 1-2 ganger før dere utvider med funksjonalitet for å styre hva mockene returnerer 🤔
  Kanskje er det en god idé, kanskje ikke!
 */

export const fetchPersonMock = createMock({
    request: {
        query: FetchPersonDocument,
        variables: {
            personPseudoId: '12345678-90ab-cdef-fedc-ba0987654321',
        },
    },
    result: {
        data: {
            __typename: 'Query',
            person: null,
        },
    },
});
