import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { Varsler } from '@components/Varsler';
import { FetchPersonDocument } from '@io/graphql';
import { postPersonSok } from '@io/rest/generated/personsøk/personsøk';
import { enPerson } from '@test-data/person';
import { createInitialQuery, render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Personsøk } from './Personsøk';

vi.mock('@io/rest/generated/personsøk/personsøk');

describe('Personsøk', () => {
    it('should fetch a person and redirect to dagoversikt', async () => {
        const personPseudoId = 'fb8c1382-bf1e-4027-9ab8-37a2c7772231';
        (postPersonSok as Mock).mockReturnValueOnce({
            data: { personPseudoId: personPseudoId, klarForVisning: true },
        });

        render(<Personsøk />);

        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), '1234567891000');
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

        expect(mockRouter.pathname).toEqual('/person/[personPseudoId]/dagoversikt');
    });

    it('when it errors it should redirect to root and display varsel', async () => {
        mockRouter.setCurrentUrl('/person/fb8c1382-bf1e-4027-9ab8-37a2c7772231/dagoversikt');

        (postPersonSok as Mock).mockReturnValueOnce({
            data: undefined,
            status: 404,
        });

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
                            person: enPerson({
                                aktorId: '1111111111111',
                                fodselsnummer: '12345678910',
                            }),
                        },
                        { personPseudoId: '11111111-1111-1111-1111-111111111111' },
                    ),
                ],
            },
        );

        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), '1234567891000');
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

        expect(mockRouter.pathname).toEqual('/');
        expect(screen.getByText('Personen er ikke i Speil'));
    });
});
