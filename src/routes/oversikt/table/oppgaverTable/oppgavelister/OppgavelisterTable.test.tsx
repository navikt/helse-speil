import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { OppgavelisterTable } from './OppgavelisterTable';

const submitSøkMock = vi.fn();

vi.mock('@state/oppgavelister', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/oppgavelister')>()),
    useSubmitOppgavelisteSok: () => submitSøkMock,
}));

vi.mock('@io/rest/generated/oppgaver/oppgaver', () => ({
    useGetOppgaver: () => ({ data: undefined, error: null, isFetching: false }),
}));

describe('OppgavelisterTable', () => {
    beforeEach(() => {
        sessionStorage.clear();
        submitSøkMock.mockClear();
    });

    it('viser feilmelding og søker ikke når ingen oppgaveliste er valgt', async () => {
        render(<OppgavelisterTable />);

        await userEvent.click(screen.getByRole('button', { name: 'Hent oppgaver' }));

        const feilmelding = await screen.findByText('Du må velge en oppgaveliste');
        expect(feilmelding).toBeVisible();
        expect(submitSøkMock).not.toHaveBeenCalled();

        expect(screen.getByRole('combobox', { name: /Oppgaveliste/ })).toHaveAttribute('aria-invalid', 'true');
        expect(feilmelding.closest('[aria-live]')).not.toBeNull();
    });

    it('lar knappen være trykkbar selv uten valgt oppgaveliste', () => {
        render(<OppgavelisterTable />);

        expect(screen.getByRole('button', { name: 'Hent oppgaver' })).toBeEnabled();
    });

    it('søker og fjerner feilmeldingen når en oppgaveliste velges', async () => {
        render(<OppgavelisterTable />);

        const knapp = screen.getByRole('button', { name: 'Hent oppgaver' });
        await userEvent.click(knapp);
        expect(await screen.findByText('Du må velge en oppgaveliste')).toBeVisible();

        await userEvent.click(screen.getByRole('combobox', { name: /Oppgaveliste/ }));
        await userEvent.click(await screen.findByRole('option', { name: 'Restanseteam - Frilans' }));

        expect(screen.queryByText('Du må velge en oppgaveliste')).not.toBeInTheDocument();

        await userEvent.click(knapp);
        expect(submitSøkMock).toHaveBeenCalledTimes(1);
    });
});
