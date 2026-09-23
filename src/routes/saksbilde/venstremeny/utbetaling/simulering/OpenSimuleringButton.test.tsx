import React from 'react';
import { vi } from 'vitest';

import { enSimulering } from '@test-data/simulering';
import { enUtbetaling } from '@test-data/utbetaling';
import { render } from '@test-utils';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OpenSimuleringButton } from './OpenSimuleringButton';

describe('OpenSimuleringButton', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('rendrer en knapp, ikke en lenke uten destinasjon', () => {
        rendre();

        const knapp = screen.getByRole('button', { name: 'Simulering' });

        expect(knapp).toBeVisible();
        expect(knapp).toHaveAttribute('aria-expanded', 'false');
        expect(knapp).not.toHaveAttribute('href');
    });

    it('åpner simuleringen i et eget vindu', async () => {
        const popup = etFalskPopupvindu();
        vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);

        rendre();
        await userEvent.click(screen.getByRole('button', { name: 'Simulering' }));

        await waitFor(() => expect(popup.document.body.textContent).toContain('Simulering'));
        expect(popup.document.body.textContent).toContain('987654321 EN ARBEIDSGIVER AS');
        expect(popup.document.body.querySelector('[data-sensitive]')).not.toBeNull();
        expect(popup.document.title).toBe('Simulering');
        expect(screen.getByRole('button', { name: 'Simulering' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('tar med temaet fra hovedvinduet', async () => {
        document.documentElement.classList.add('dark');
        const popup = etFalskPopupvindu();
        vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);

        rendre();
        await userEvent.click(screen.getByRole('button', { name: 'Simulering' }));

        await waitFor(() => expect(popup.document.documentElement.classList.contains('dark')).toBe(true));
        document.documentElement.classList.remove('dark');
    });

    it('tar med anonymiseringen fra hovedvinduet', async () => {
        localStorage.setItem('anonymisering', 'true');
        const popup = etFalskPopupvindu();
        vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);

        rendre();
        await userEvent.click(screen.getByRole('button', { name: 'Simulering' }));

        await waitFor(() => expect(popup.document.documentElement.classList.contains('anonymized')).toBe(true));
        localStorage.clear();
    });

    it('lukker vinduet og rydder opp når komponenten unmountes', async () => {
        const popup = etFalskPopupvindu();
        vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);

        const { unmount } = rendre();
        await userEvent.click(screen.getByRole('button', { name: 'Simulering' }));
        await waitFor(() => expect(popup.document.body.textContent).toContain('Simulering'));

        unmount();

        expect(popup.close).toHaveBeenCalled();
        expect(popup.removeEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function));
    });

    it('rydder opp når saksbehandler lukker vinduet selv', async () => {
        const popup = etFalskPopupvindu();
        vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);
        const observerSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

        rendre();
        await userEvent.click(screen.getByRole('button', { name: 'Simulering' }));
        await waitFor(() => expect(popup.document.body.textContent).toContain('Simulering'));

        const [, håndterLukking] = popup.addEventListener.mock.calls.find(([type]) => type === 'pagehide') ?? [];
        await act(async () => håndterLukking());

        expect(observerSpy).toHaveBeenCalled();
        expect(popup.removeEventListener).toHaveBeenCalledWith('pagehide', expect.any(Function));
        expect(screen.getByRole('button', { name: 'Simulering' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('varsler saksbehandler når nettleseren blokkerer vinduet', async () => {
        vi.spyOn(window, 'open').mockReturnValue(null);

        rendre();
        await userEvent.click(screen.getByRole('button', { name: 'Simulering' }));

        expect(await screen.findByText(/Nettleseren blokkerte vinduet/)).toBeVisible();
        expect(screen.getByRole('button', { name: 'Simulering' })).toHaveAttribute('aria-expanded', 'false');
    });
});

function rendre() {
    return render(<OpenSimuleringButton simulering={enSimulering()} utbetaling={enUtbetaling()} />);
}

function etFalskPopupvindu() {
    const popupDokument = document.implementation.createHTMLDocument('');

    return {
        document: popupDokument,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        close: vi.fn(),
    };
}
