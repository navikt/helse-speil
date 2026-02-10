import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { Varsler } from '@components/Varsler';
import { postPersonSok } from '@io/rest/generated/personsøk/personsøk';
import { useFetchPersonQuery } from '@state/person';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Personsøk } from './Personsøk';

vi.mock('@io/rest/generated/personsøk/personsøk');
vi.mock('@state/person');

describe('Personsøk', () => {
    it('finds a personPseudoId and redirects to dagoversikt', async () => {
        const personPseudoId = 'fb8c1382-bf1e-4027-9ab8-37a2c7772231';
        (postPersonSok as Mock).mockResolvedValueOnce({ personPseudoId: personPseudoId, klarForVisning: true });

        render(<Personsøk />);

        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), '1234567891000');
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

        await vi.waitFor(() => {
            expect(mockRouter.pathname).toEqual('/person/[personPseudoId]/dagoversikt');
        });
    });

    it('displays varsel when person is not found', async () => {
        (postPersonSok as Mock).mockRejectedValueOnce({ response: { status: 404 } });
        (useFetchPersonQuery as Mock).mockReturnValue({});

        render(
            <div>
                <Varsler />
                <Personsøk />
            </div>,
        );

        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), '1234567891000');
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

        expect(screen.getByText('Personen er ikke i Speil'));
    });
});
