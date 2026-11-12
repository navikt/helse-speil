import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { UtbetalingHeader } from './UtbetalingHeader';

vi.mock('@hooks/brukerrolleHooks', () => ({
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => true,
}));

const velgEndringshandling = vi.fn();

beforeEach(() => {
    velgEndringshandling.mockClear();
});

describe('UtbetalingHeader', () => {
    it('viser endringshandlingene i rekkefølge', () => {
        renderHeader();

        expect(screen.getAllByRole('button').map((knapp) => knapp.textContent)).toEqual([
            'Legg til dager',
            'Endre dagtype',
            'Legg til graderte ytelser',
        ]);
    });

    it('velger endringshandlingen', async () => {
        renderHeader();

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));

        expect(velgEndringshandling).toHaveBeenCalledWith('Endre dagtype');
    });

    it('viser ingen handlinger når perioden er forkastet', () => {
        renderHeader({ periodeErForkastet: true });

        expect(screen.queryByRole('button', { name: 'Endre dagtype' })).not.toBeInTheDocument();
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
