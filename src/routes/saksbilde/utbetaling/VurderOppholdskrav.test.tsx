import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { VurderOppholdskrav } from './VurderOppholdskrav';

const toggle = vi.hoisted(() => ({ kanVurdereOppholdskrav: true }));

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useKanVurdereOppholdskrav: () => toggle.kanVurdereOppholdskrav,
}));

vi.mock('@io/rest/generated/avslagsdager/vurderinger/vurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/avslagsdager/vurderinger/vurderinger')>()),
    usePostOppholdskravvurderingBehandler: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}));

const knapp = { name: 'Vurder oppholdskrav' };

beforeEach(() => {
    toggle.kanVurdereOppholdskrav = true;
});

describe('VurderOppholdskrav', () => {
    it('åpner skjemaet for de markerte dagene', async () => {
        renderKnapp({ markerteDager: dager(getUtbetalingstabellDag({ dato: '2024-07-15' })) });

        await userEvent.click(screen.getByRole('button', knapp));

        expect(screen.getByRole('dialog', { name: 'Vurder oppholdskrav' })).toBeVisible();
        expect(screen.getByText('15.07.2024')).toBeVisible();
    });

    it('vises ikke når togglen er av', () => {
        toggle.kanVurdereOppholdskrav = false;

        renderKnapp({ markerteDager: dager(getUtbetalingstabellDag()) });

        expect(screen.queryByRole('button', knapp)).not.toBeInTheDocument();
    });

    it('er sperret når ingen dager er markert', () => {
        renderKnapp({ markerteDager: new Map() });

        expect(screen.getByRole('button', knapp)).toBeDisabled();
        expect(screen.getByText('Marker dagene som skal vurderes.')).toBeVisible();
    });

    it('er sperret når det finnes endringer som ikke er sendt', () => {
        renderKnapp({ markerteDager: dager(getUtbetalingstabellDag()), harUsendteEndringer: true });

        expect(screen.getByRole('button', knapp)).toBeDisabled();
        expect(
            screen.getByText('Send eller forkast endringene av dager før du vurderer oppholdskravet.'),
        ).toBeVisible();
    });

    it('er sperret når en markert dag er avslått av en annen grunn', () => {
        renderKnapp({
            markerteDager: dager(
                getUtbetalingstabellDag({ dato: '2024-07-15' }),
                getUtbetalingstabellDag({
                    dato: '2024-07-16',
                    begrunnelser: [ApiBegrunnelse.AVSLATT_MELDING_TIL_NAV_DAG],
                }),
            ),
        });

        expect(screen.getByRole('button', knapp)).toBeDisabled();
        expect(
            screen.getByText(
                'En dag kan bare ha én avslagsårsak. 16.07.2024 er avslått fordi melding til Nav kom for sent. Endre dagen før du vurderer oppholdskravet.',
            ),
        ).toBeVisible();
    });
});

function renderKnapp({
    markerteDager,
    harUsendteEndringer = false,
}: {
    markerteDager: Map<string, Utbetalingstabelldag>;
    harUsendteEndringer?: boolean;
}) {
    return render(
        <VurderOppholdskrav
            personPseudoId="en-person"
            behandlingId="en-behandling"
            markerteDager={markerteDager}
            harUsendteEndringer={harUsendteEndringer}
        />,
    );
}

function dager(...dager: Utbetalingstabelldag[]): Map<string, Utbetalingstabelldag> {
    return new Map(dager.map((dag) => [dag.dato, dag]));
}
