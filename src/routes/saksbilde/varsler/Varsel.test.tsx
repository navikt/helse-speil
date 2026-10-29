import { fetchMock, jsonResponse } from '../../../../vitest.setup';
import React from 'react';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { render, screen } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Varsel } from './Varsel';

vi.mock('@hooks/brukerrolleHooks', () => ({ useHarSkrivetilgang: () => true }));
vi.mock('@state/person', () => ({ useOppdaterPersonICache: () => vi.fn(), mapPerioder: vi.fn() }));

describe('Varsel', () => {
    it('viser loader til varselet er hentet på nytt etter vurdering', async () => {
        let svarPåHenting: (response: Response) => void = () => {};
        fetchMock
            .mockResolvedValueOnce(jsonResponse(undefined, 204))
            .mockReturnValueOnce(new Promise((resolve) => (svarPåHenting = resolve)));

        render(<Varsel varsel={varsel} type="aktiv" />);
        await userEvent.click(screen.getByRole('button', { name: 'Vurdert' }));

        expect(await screen.findByTitle(/venter/i)).toBeInTheDocument();

        svarPåHenting(jsonResponse({ ...varsel, status: 'VURDERT', vurdering: null }));

        await waitFor(() => expect(screen.getByRole('button', { name: 'Vurdert' })).toBeInTheDocument());
    });

    it('viser feilmelding og fjerner loader når henting etter vurdering feiler', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(undefined, 204)).mockResolvedValueOnce(jsonResponse({}, 404));

        render(<Varsel varsel={varsel} type="aktiv" />);
        await userEvent.click(screen.getByRole('button', { name: 'Vurdert' }));

        expect(await screen.findByText('Varselet finnes ikke lenger. Oppdater siden (F5).')).toBeVisible();
        expect(screen.getByRole('button', { name: 'Vurdert' })).toBeInTheDocument();
    });
});

const varsel: ApiVarselDTO = {
    id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
    definisjonId: 'EN_ID',
    behandlingId: 'EN_ID',
    opprettet: '2020-01-01',
    kode: 'EN_KODE',
    tittel: 'Et varsel',
    forklaring: null,
    handling: null,
    vurdering: null,
};
