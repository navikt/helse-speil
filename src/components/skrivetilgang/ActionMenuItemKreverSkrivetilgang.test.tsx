import { ActionMenu, Button } from '@navikt/ds-react';

import { ActionMenuItemKreverSkrivetilgang } from '@components/skrivetilgang/ActionMenuItemKreverSkrivetilgang';
import { UTEN_SKRIVETILGANG_TEKST } from '@components/skrivetilgang/utenSkrivetilgang';
import { render, screen } from '@test-utils';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockUseHarSkrivetilgang = vi.fn();

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => mockUseHarSkrivetilgang(),
}));

describe('ActionMenuItemKreverSkrivetilgang', () => {
    it('kaller onSelect når brukeren har skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(true);
        const onSelect = vi.fn();

        renderMeny(onSelect);
        await userEvent.click(screen.getByRole('button', { name: 'Meny' }));
        await userEvent.click(await screen.findByRole('menuitem', { name: 'Tildel meg' }));

        expect(onSelect).toHaveBeenCalledOnce();
    });

    it('deaktiverer menyvalget uten skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);
        const onSelect = vi.fn();

        renderMeny(onSelect);
        await userEvent.click(screen.getByRole('button', { name: 'Meny' }));
        const menyvalg = await screen.findByRole('menuitem', { name: 'Tildel meg' });

        expect(menyvalg).toHaveAttribute('aria-disabled', 'true');
        await userEvent.click(menyvalg);
        expect(onSelect).not.toHaveBeenCalled();
    });

    it('viser forklaring ved hover uten skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);

        renderMeny(vi.fn());
        await userEvent.click(screen.getByRole('button', { name: 'Meny' }));
        const menyvalg = await screen.findByRole('menuitem', { name: 'Tildel meg' });

        // Aksel-CSS setter pointer-events: none på deaktiverte menyvalg. jsdom leser ikke den CSS-en, så vi sjekker overstyringen.
        expect(menyvalg).toHaveClass('pointer-events-auto');
        await userEvent.hover(menyvalg);
        expect(await screen.findByRole('tooltip')).toHaveTextContent(UTEN_SKRIVETILGANG_TEKST);
    });

    it('gir ikke menyvalget fokus ved klikk uten skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);

        renderMeny(vi.fn());
        await userEvent.click(screen.getByRole('button', { name: 'Meny' }));
        const menyvalg = await screen.findByRole('menuitem', { name: 'Tildel meg' });

        expect(fireEvent.mouseDown(menyvalg)).toBe(false);
    });
});

function renderMeny(onSelect: () => void) {
    return render(
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button>Meny</Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <ActionMenuItemKreverSkrivetilgang onSelect={onSelect}>Tildel meg</ActionMenuItemKreverSkrivetilgang>
            </ActionMenu.Content>
        </ActionMenu>,
    );
}
