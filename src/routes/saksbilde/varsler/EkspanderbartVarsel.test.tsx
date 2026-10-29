import React from 'react';

import { axe } from '@/test/axe';
import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';
import { VarselMedHandling } from './VarselMedHandling';

describe('EkspanderbartVarsel', () => {
    it('ekspanderer og kollapser ved klikk hvor som helst i headeren', async () => {
        render(<TestVarsel />);

        await userEvent.click(screen.getByText('Tittel'));
        expect(chevron()).toHaveAttribute('aria-expanded', 'true');

        await userEvent.click(screen.getByText('Tittel'));
        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggler med tastatur via chevron-knappen', async () => {
        render(<TestVarsel />);

        chevron().focus();
        await userEvent.keyboard('{Enter}');
        expect(chevron()).toHaveAttribute('aria-expanded', 'true');

        await userEvent.keyboard('{Enter}');
        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('ekspanderer ikke ved klikk i sone merket data-ikke-ekspander eller på andre knapper', async () => {
        render(<TestVarsel />);

        await userEvent.click(screen.getByText('Død sone'));
        await userEvent.click(screen.getByRole('button', { name: 'Annen knapp' }));

        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('ekspanderer ikke når brukeren har markert tekst', async () => {
        render(<TestVarsel />);
        const tittel = screen.getByText('Tittel');
        const range = document.createRange();
        range.selectNodeContents(tittel);
        window.getSelection()?.addRange(range);

        tittel.click();
        window.getSelection()?.removeAllRanges();

        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('åpner og lukker ved dobbeltklikk uten å markere tekst', async () => {
        render(<TestVarsel />);

        await userEvent.dblClick(screen.getByText('Tittel'));

        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
        expect(window.getSelection()?.toString()).toBe('');

        await userEvent.click(screen.getByText('Tittel'));
        expect(chevron()).toHaveAttribute('aria-expanded', 'true');
    });

    it('rendrer uten violations', async () => {
        const { container } = render(<TestVarsel />);

        const result = await axe(container);

        expect(result.violations).toEqual([]);
    });
});

describe('VarselMedHandling', () => {
    it('ekspanderer ved klikk på tittelen', async () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="aktiv" />);

        await userEvent.click(screen.getByText('Et varsel'));

        expect(chevron()).toHaveAttribute('aria-expanded', 'true');
    });

    it('ekspanderer ikke ved klikk i kolonnen rundt Vurder-knappen', async () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="aktiv" />);
        const avhuking = screen.getByRole('button', { name: 'Vurdert' });

        await userEvent.click(avhuking.parentElement!);

        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('ekspanderer ikke ved klikk på deaktivert Vurder-knapp', async () => {
        render(
            <VarselMedHandling
                varsel={lagVarsel({
                    ident: 'A123456',
                    status: ApiSaksbildeVarselstatus.GODKJENT,
                    tidsstempel: '2020-01-02T10:00:00',
                })}
                type="ferdig-behandlet"
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Vurdert' }));

        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('viser vurderingsstatus med aria-pressed', () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="aktiv" />);

        expect(screen.getByRole('button', { name: 'Vurdert' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('viser feil-varsel som ikon, ikke knapp', () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="feil" />);

        expect(screen.getByRole('img', { name: 'Feil' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurdert' })).not.toBeInTheDocument();
    });
});

function TestVarsel() {
    return (
        <EkspanderbartVarsel>
            <EkspanderbartVarsel.Header>
                <span data-ikke-ekspander>Død sone</span>
                <span>Tittel</span>
                <button type="button">Annen knapp</button>
            </EkspanderbartVarsel.Header>
            <EkspanderbartVarsel.Content>Innhold</EkspanderbartVarsel.Content>
        </EkspanderbartVarsel>
    );
}

function chevron() {
    return screen.getByRole('button', { name: 'Detaljer' });
}

function lagVarsel(vurdering: ApiVarselDTO['vurdering']): ApiVarselDTO {
    return {
        id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
        definisjonId: 'EN_ID',
        behandlingId: 'EN_ID',
        opprettet: '2020-01-01',
        kode: 'EN_KODE',
        tittel: 'Et varsel',
        forklaring: 'Forklaring',
        handling: 'Handling',
        vurdering,
    };
}
