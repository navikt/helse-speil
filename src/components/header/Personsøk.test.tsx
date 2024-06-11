import { createMock, render, screen } from '@test-utils';

import { FetchPersonDocument } from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enPerson } from '@test-data/person';
import userEvent from '@testing-library/user-event';

import { Personsøk } from './Personsøk';

describe('Personsøk', () => {
    it('should ', async () => {
        render(<Personsøk />, {
            mocks: [
                createMock({
                    request: { query: FetchPersonDocument, variables: { aktorId: '1234567891000' } },
                    result: {
                        data: {
                            __typename: 'Query',
                            person: enPerson({
                                aktorId: '1234567891000',
                                fodselsnummer: '1234567891000',
                            }),
                        },
                    },
                }),
            ],
        });

        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), '1234567891000');
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
    });
});
