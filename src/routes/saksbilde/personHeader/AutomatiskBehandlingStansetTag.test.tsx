import React from 'react';
import { Mock } from 'vitest';

import { axe } from '@/test/axe';
import { usePatchSaksbehandlerStans } from '@io/rest/generated/personer/personer';
import { AutomatiskBehandlingStansetTag } from '@saksbilde/personHeader/AutomatiskBehandlingStansetTag';
import { render, screen } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@io/rest/generated/personer/personer', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    usePatchSaksbehandlerStans: vi.fn(),
}));

describe('AutomatiskBehandlingStansetTag', () => {
    beforeEach(() => {
        (usePatchSaksbehandlerStans as Mock).mockReturnValue({ mutate: vi.fn(), isPending: false, error: null });
    });

    it('rendrer ingenting når automatisk behandling ikke er stanset', () => {
        render(<StansetTag erStanset={false} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('viser popover med begrunnelse når taggen klikkes', async () => {
        render(<StansetTag />);

        await userEvent.click(screen.getByRole('button', { name: /Automatisk behandling stanset/ }));

        expect(await screen.findByRole('heading', { name: 'Automatisk behandling er stanset' })).toBeVisible();
        expect(screen.getByText('Begrunnelse')).toBeVisible();
        expect(screen.getByText('Mistanke om feil i inntekt')).toBeVisible();
        expect(screen.getByText('Når du opphever stansen, kan sykepengene behandles automatisk igjen')).toBeVisible();
    });

    it('viser fallback når begrunnelse mangler', async () => {
        render(<StansetTag begrunnelse={null} />);

        await userEvent.click(screen.getByRole('button', { name: /Automatisk behandling stanset/ }));

        expect(await screen.findByText('Ingen begrunnelse')).toBeVisible();
    });

    it('lukker popoveren ved klikk på Avbryt', async () => {
        render(<StansetTag />);

        const tagKnapp = screen.getByRole('button', { name: /Automatisk behandling stanset/ });
        await userEvent.click(tagKnapp);
        expect(tagKnapp).toHaveAttribute('aria-expanded', 'true');

        await userEvent.click(await screen.findByRole('button', { name: 'Avbryt' }));

        await waitFor(() => expect(tagKnapp).toHaveAttribute('aria-expanded', 'false'));
        expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
    });

    it('åpner opphev-dialogen ved klikk på Opphev stans', async () => {
        render(<StansetTag />);

        await userEvent.click(screen.getByRole('button', { name: /Automatisk behandling stanset/ }));
        await userEvent.click(await screen.findByRole('button', { name: 'Opphev stans' }));

        expect(await screen.findByRole('dialog', { name: 'Opphev stans av automatisk behandling' })).toBeVisible();
    });

    it('har ingen uu-feil med åpen popover', async () => {
        const { container } = render(<StansetTag />);

        await userEvent.click(screen.getByRole('button', { name: /Automatisk behandling stanset/ }));
        await screen.findByRole('heading', { name: 'Automatisk behandling er stanset' });

        expect((await axe(container)).violations).toEqual([]);
    });
});

function StansetTag({
    erStanset = true,
    begrunnelse = 'Mistanke om feil i inntekt',
}: {
    erStanset?: boolean;
    begrunnelse?: string | null;
}) {
    return (
        <AutomatiskBehandlingStansetTag
            erStanset={erStanset}
            dato="2026-10-01T12:00:00"
            begrunnelse={begrunnelse}
            fødselsnummer="12345678910"
        />
    );
}
