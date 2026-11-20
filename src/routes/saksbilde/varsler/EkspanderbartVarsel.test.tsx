import { axe } from '@/test/axe';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';

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

    it('gir knappen navn fra elementet headeren peker på', () => {
        render(
            <EkspanderbartVarsel>
                <EkspanderbartVarsel.Header aria-labelledby="navn">
                    <span id="navn">Et navn</span>
                </EkspanderbartVarsel.Header>
                <EkspanderbartVarsel.Content>Innhold</EkspanderbartVarsel.Content>
            </EkspanderbartVarsel>,
        );

        expect(screen.getByRole('button', { name: 'Et navn' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('rendrer uten violations', async () => {
        const { container } = render(<TestVarsel />);

        const result = await axe(container);

        expect(result.violations).toEqual([]);
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
