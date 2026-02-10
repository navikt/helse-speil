import mockRouter from 'next-router-mock';
import React from 'react';
import { Mock } from 'vitest';

import { customAxios } from '@app/axios/axiosClient';
import { Varsler } from '@components/Varsler';
import { useFetchPersonQuery } from '@state/person';
import { render, screen } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Personsøk } from './Personsøk';

vi.mock('@state/person');

describe('Personsøk', () => {
    it('finds a personPseudoId and redirects to dagoversikt', async () => {
        (customAxios as unknown as Mock).mockResolvedValue({
            data: {
                klarForVisning: true,
                personPseudoId: 'en random uuid',
            },
        });

        render(<Personsøk />);

        const søketekst = '1234567891000';
        await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), søketekst);
        await userEvent.click(screen.getByRole('button', { name: 'Søk' }));

        await waitFor(() => {
            expect(mockRouter.pathname).toEqual('/person/[personPseudoId]/dagoversikt');
        });
    });

    it('displays varsel when person is not found', async () => {
        (customAxios as unknown as Mock).mockRejectedValue({ response: { status: 404 } });
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
