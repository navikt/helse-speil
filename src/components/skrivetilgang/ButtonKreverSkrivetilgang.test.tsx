import { axe } from '@/test/axe';
import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';
import { UTEN_SKRIVETILGANG_TEKST } from '@components/skrivetilgang/utenSkrivetilgang';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

const mockUseHarSkrivetilgang = vi.fn();

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => mockUseHarSkrivetilgang(),
}));

describe('ButtonKreverSkrivetilgang', () => {
    it('kaller onClick når brukeren har skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(true);
        const onClick = vi.fn();

        render(<ButtonKreverSkrivetilgang onClick={onClick}>Lagre</ButtonKreverSkrivetilgang>);

        const knapp = screen.getByRole('button', { name: 'Lagre' });
        expect(knapp).not.toHaveAttribute('aria-disabled');
        await userEvent.click(knapp);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('deaktiverer knappen uten skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);
        const onClick = vi.fn();

        render(<ButtonKreverSkrivetilgang onClick={onClick}>Lagre</ButtonKreverSkrivetilgang>);

        const knapp = screen.getByRole('button', { name: 'Lagre' });
        expect(knapp).toHaveAttribute('aria-disabled', 'true');
        await userEvent.click(knapp);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('sender ikke inn skjemaet uten skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);
        const onSubmit = vi.fn((event) => event.preventDefault());

        render(
            <form onSubmit={onSubmit}>
                <input aria-label="Tekst" />
                <ButtonKreverSkrivetilgang type="submit">Send</ButtonKreverSkrivetilgang>
            </form>,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Send' }));
        await userEvent.type(screen.getByRole('textbox', { name: 'Tekst' }), 'hei{Enter}');
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('viser forklaring når knappen får fokus uten skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);

        render(<ButtonKreverSkrivetilgang>Lagre</ButtonKreverSkrivetilgang>);

        await userEvent.tab();
        expect(screen.getByRole('button', { name: 'Lagre' })).toHaveFocus();
        expect(await screen.findByText(UTEN_SKRIVETILGANG_TEKST)).toBeInTheDocument();
    });

    it('rendrer lenkeknapp som knapp uten href uten skrivetilgang', () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);

        render(
            <ButtonKreverSkrivetilgang as="a" href="/et-sted">
                Ny melding
            </ButtonKreverSkrivetilgang>,
        );

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ny melding' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('rendrer uten violations uten skrivetilgang', async () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);

        const { container } = render(<ButtonKreverSkrivetilgang>Lagre</ButtonKreverSkrivetilgang>);

        const result = await axe(container);
        expect(result.violations).toEqual([]);
    });
});
