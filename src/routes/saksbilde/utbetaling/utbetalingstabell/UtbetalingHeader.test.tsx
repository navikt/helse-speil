import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { UtbetalingHeader } from './UtbetalingHeader';

const toggle = vi.hoisted(() => ({ kanVurdereOppholdskrav: true }));

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useKanVurdereOppholdskrav: () => toggle.kanVurdereOppholdskrav,
}));

vi.mock('@hooks/brukerrolleHooks', () => ({
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => true,
}));

const velgEndringshandling = vi.fn();

beforeEach(() => {
    toggle.kanVurdereOppholdskrav = true;
    velgEndringshandling.mockClear();
});

describe('UtbetalingHeader', () => {
    it('viser «Vurder oppholdskrav» til høyre for de andre handlingene', () => {
        renderHeader();

        expect(screen.getAllByRole('button').map((knapp) => knapp.textContent)).toEqual([
            'Legg til dager',
            'Endre dagtype',
            'Legg til graderte ytelser',
            'Vurder oppholdskrav',
        ]);
    });

    it('velger vurdering av oppholdskravet', async () => {
        renderHeader();

        await userEvent.click(screen.getByRole('button', { name: 'Vurder oppholdskrav' }));

        expect(velgEndringshandling).toHaveBeenCalledWith('Vurder oppholdskrav');
    });

    it('viser ikke «Vurder oppholdskrav» når togglen er av', () => {
        toggle.kanVurdereOppholdskrav = false;

        renderHeader();

        expect(screen.queryByRole('button', { name: 'Vurder oppholdskrav' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Endre dagtype' })).toBeVisible();
    });

    it('viser ingen handlinger når perioden er forkastet', () => {
        renderHeader({ periodeErForkastet: true });

        expect(screen.queryByRole('button', { name: 'Vurder oppholdskrav' })).not.toBeInTheDocument();
    });
});

function renderHeader({ periodeErForkastet = false }: { periodeErForkastet?: boolean } = {}) {
    return render(
        <UtbetalingHeader
            periodeErForkastet={periodeErForkastet}
            velgEndringshandling={velgEndringshandling}
            kanLeggeTilDager
            inntektsforholdReferanse={{ type: 'Selvstendig Næring' }}
        />,
    );
}
