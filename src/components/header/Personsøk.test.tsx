import { createInitialQuery, createMock, render, screen } from '@test-utils';
import { GraphQLError } from 'graphql';
import mockRouter from 'next-router-mock';

import { Varsler } from '@components/Varsler';
import { FetchPersonDocument } from '@io/graphql';
import { enPerson } from '@test-data/person';
import userEvent from '@testing-library/user-event';

import { Personsøk } from './Personsøk';

describe('Personsøk', () => {
    it('should fetch a person and redirect to dagoversikt', async () => {
        const lazyFetchMock = jest.fn();
        render(<Personsøk />, {
            mocks: [
                createMock({
                    request: { query: FetchPersonDocument, variables: { aktorId: '1234567891000' } },
                    result: () => {
                        lazyFetchMock();

                        return {
                            data: {
                                __typename: 'Query' as const,
                                person: enPerson({
                                    aktorId: '1234567891000',
                                    fodselsnummer: '1234567891000',
                                }),
                            },
                        };
                    },
                }),
            ],
        });

        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), '1234567891000');
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

        expect(lazyFetchMock).toHaveBeenCalledTimes(1);
        expect(mockRouter.pathname).toEqual('/person/[aktorId]/dagoversikt');
    });

    it('when it errors it should redirect to root and display varsel', async () => {
        mockRouter.setCurrentUrl('/person/annen-bruker/dagoversikt');

        render(
            <div>
                <Varsler />
                <Personsøk />
            </div>,
            {
                initialQueries: [
                    // Bruker på routen lastes først pga <Varsler />
                    createInitialQuery(
                        FetchPersonDocument,
                        {
                            __typename: 'Query',
                            person: enPerson({ aktorId: '1234567891000', fodselsnummer: '1234567891000' }),
                        },
                        { aktorId: 'annen-bruker' },
                    ),
                ],
                mocks: [
                    createMock({
                        request: { query: FetchPersonDocument, variables: { aktorId: '1234567891000' } },
                        result: {
                            data: null,
                            errors: [
                                new GraphQLError('Not found', {
                                    // Dette er hvordan spesialist svarer når bruker ikke finnes
                                    extensions: { code: 404 },
                                }),
                            ],
                        },
                    }),
                ],
            },
        );

        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), '1234567891000');
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

        expect(mockRouter.pathname).toEqual('/');
        expect(screen.getByText('Personen har ingen perioder til godkjenning eller tidligere utbetalinger i Speil'));
    });
});
