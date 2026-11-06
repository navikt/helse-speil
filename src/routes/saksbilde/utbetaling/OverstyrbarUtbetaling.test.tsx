import { Mock, vi } from 'vitest';

import { ApiYrkesaktivitetstype } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { ApiBegrunnelse, ApiPeriodetype } from '@io/rest/generated/spesialist.schemas';
import { useGraderteAndreYtelser } from '@state/graderteAndreYtelser';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';

import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';

let postOverstyringArguments: [Utbetalingstabelldag[], string] | [] = [];

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => true,
    useHarBeslutterrolle: () => true,
}));

vi.mock('next/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('next/navigation')>()),
    useParams: () => ({ personPseudoId: 'en-person' }),
}));

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useKanVurdereOppholdskrav: () => true,
}));

vi.mock('@utils/featureToggles', () => ({
    useSkalSeGraderteAndreYtelser: vi.fn(),
}));

vi.mock('@state/graderteAndreYtelser', () => ({
    useGraderteAndreYtelser: vi.fn(),
}));

vi.mock('./utbetalingstabell/useOverstyrDager', () => ({
    useOverstyrDager: () => ({
        postOverstyring: (_: Utbetalingstabelldag[], overstyrteDager: Utbetalingstabelldag[], begrunnelse: string) => {
            postOverstyringArguments = [overstyrteDager, begrunnelse];
        },
    }),
}));

vi.mock('@io/rest/generated/avslagsdager/vurderinger/vurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/avslagsdager/vurderinger/vurderinger')>()),
    usePostOppholdskravvurderingBehandler: (options?: {
        mutation?: { onSuccess?: (data: unknown, variables: unknown) => void };
    }) => ({
        mutate: (variables: unknown) => options?.mutation?.onSuccess?.({ vurderingId: 'id' }, variables),
        isPending: false,
        error: null,
    }),
}));

vi.mock('./utbetalingstabell/useAlderVedSkjæringstidspunkt', () => ({
    useAlderVedSkjæringstidspunkt: () => 30,
}));

const dager = new Map<string, Utbetalingstabelldag>([
    ['2022-01-01', getUtbetalingstabellDag({ dato: '2022-01-01' })],
    ['2022-01-02', getUtbetalingstabellDag({ dato: '2022-01-02' })],
    ['2022-01-03', getUtbetalingstabellDag({ dato: '2022-01-03' })],
    ['2022-01-04', getUtbetalingstabellDag({ dato: '2022-01-04' })],
    ['2022-01-05', getUtbetalingstabellDag({ dato: '2022-01-05' })],
]);

describe('OverstyrbarUtbetaling', () => {
    beforeEach(() => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(false);
        (useGraderteAndreYtelser as Mock).mockReturnValue([]);
    });

    test('overstyrer utbetalingstabell', async () => {
        const person = enPerson();
        const periode = enBeregnetPeriode({
            fom: '2022-01-01',
            tom: '2022-01-31',
        }).medSkjæringstidspunkt('2022-01-01');
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        render(
            <OverstyrbarUtbetaling inntektsforhold={arbeidsgiver} person={person} dager={dager} periode={periode} />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));

        const checkboxes = screen.getAllByRole('checkbox');
        await userEvent.click(checkboxes[1]!);
        await userEvent.click(checkboxes[2]!);
        await userEvent.click(checkboxes[3]!);

        expect(screen.getAllByRole('option')).toHaveLength(13);
        expect(screen.getByTestId('dagtypevelger')).toBeEnabled();

        await userEvent.selectOptions(screen.getByTestId('dagtypevelger'), screen.getAllByRole('option')[0]!);
        expect((screen.getByRole('option', { selected: true }) as HTMLOptionElement).selected).toBe(true);

        expect(screen.getByTestId('gradvelger')).toBeEnabled();
        await userEvent.clear(screen.getByTestId('gradvelger'));
        await userEvent.type(screen.getByTestId('gradvelger'), '80');
        expect(screen.getByTestId('gradvelger')).toHaveValue('80');

        await userEvent.click(screen.getByTestId('endre'));

        expect(await screen.findByTestId('oppdater')).toBeEnabled();

        await userEvent.type(screen.getByTestId('overstyring-begrunnelse'), 'En begrunnelse');
        await userEvent.click(screen.getByTestId('oppdater'));

        expect(postOverstyringArguments).toHaveLength(2);
        postOverstyringArguments[0]?.forEach((overstyrtDag) => {
            expect(overstyrtDag.dag.speilDagtype).toEqual('Syk');
            expect(overstyrtDag.grad).toEqual(80);
        });
    });

    test('Legg til dager vises ikke for forlengelser', async () => {
        const person = enPerson();
        const arbeidsgiver = enArbeidsgiver();
        const periode = enBeregnetPeriode({ periodetype: ApiPeriodetype.FORLENGELSE });
        render(
            <OverstyrbarUtbetaling inntektsforhold={arbeidsgiver} person={person} dager={dager} periode={periode} />,
        );

        expect(screen.queryByRole('button', { name: 'Legg til dager' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Endre dagtype' })).toBeVisible();
    });

    test('«Legg til dager» åpner skjemaet for å legge til dager', async () => {
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Legg til dager' }));

        expect(screen.getByRole('heading', { name: 'Legg til dager' })).toBeVisible();
        expect(screen.getByTestId('legg-til')).toBeVisible();
        expect(screen.queryByTestId('endre')).not.toBeInTheDocument();
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurder oppholdskrav' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Endre dagtype' })).not.toBeInTheDocument();
    });

    test('«Endre dagtype» åpner skjemaet for å endre dagtype', async () => {
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));

        expect(screen.getByRole('heading', { name: 'Endre dagtype' })).toBeVisible();
        expect(screen.getByTestId('dagtypevelger')).toBeVisible();
        expect(screen.queryByTestId('legg-til')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Legg til dager' })).not.toBeInTheDocument();
    });

    test('«Avbryt» lukker skjemaet og forkaster endringene som ikke er lagret', async () => {
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));
        await userEvent.click(screen.getAllByRole('checkbox')[1]!);
        await userEvent.selectOptions(screen.getByTestId('dagtypevelger'), 'Ferie');
        await userEvent.click(screen.getByTestId('endre'));
        expect(await screen.findByTestId('oppdater')).toBeEnabled();

        await userEvent.click(screen.getAllByRole('button', { name: 'Avbryt' })[0]!);

        expect(screen.queryByRole('heading', { name: 'Endre dagtype' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Legg til dager' })).toBeVisible();

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));

        expect(screen.getByTestId('oppdater')).toBeDisabled();
    });

    test('viser «Legg til graderte ytelser» bare når togglen er på', () => {
        const { rerender } = renderOverstyring(dager);
        expect(screen.queryByRole('button', { name: 'Legg til graderte ytelser' })).not.toBeInTheDocument();

        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        rerender(lagOverstyring(dager));

        expect(screen.getByRole('button', { name: 'Legg til graderte ytelser' })).toBeVisible();
    });

    test('«Legg til graderte ytelser» åpner skjemaet for å fordele graden', async () => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Legg til graderte ytelser' }));

        expect(screen.getByRole('heading', { name: 'Legg til graderte ytelser' })).toBeVisible();
        expect(screen.getByRole('combobox', { name: 'Velg annen ytelse' })).toBeVisible();
        expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
        expect(screen.queryByTestId('dagtypevelger')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurder oppholdskrav' })).not.toBeInTheDocument();
    });

    test('lagrer fordelingen av graden mellom sykepenger og en annen ytelse', async () => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        renderOverstyring(new Map([['2022-01-03', getUtbetalingstabellDag({ dato: '2022-01-03', grad: 100 })]]));

        await userEvent.click(screen.getByRole('button', { name: 'Legg til graderte ytelser' }));
        await userEvent.click(screen.getAllByRole('checkbox')[1]!);
        await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Velg annen ytelse' }), 'Foreldrepenger');
        await userEvent.type(screen.getByRole('textbox', { name: 'Sykepenger' }), '60');
        await userEvent.type(screen.getByRole('textbox', { name: 'Foreldrepenger' }), '40');
        await userEvent.click(screen.getByTestId('endre'));
        await userEvent.type(await screen.findByTestId('overstyring-begrunnelse'), 'En begrunnelse');
        await userEvent.click(screen.getByTestId('oppdater'));

        const [overstyrteDager] = postOverstyringArguments;
        expect(overstyrteDager).toHaveLength(1);
        expect(overstyrteDager?.[0]?.dag.speilDagtype).toEqual('Foreldrepenger');
        expect(overstyrteDager?.[0]?.gradertAnnenYtelse).toEqual({
            sykdomsgrad: 60,
            andreYtelseGrad: 40,
            sykdomsgradFørFordeling: 100,
        });
    });

    test('«Endre dagtype» tilbyr ikke gradert annen ytelse', async () => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));

        expect(screen.queryByRole('option', { name: 'Gradert annen ytelse' })).not.toBeInTheDocument();
    });

    test('viser fordelingen av graderte andre ytelser for arbeidsgiver', () => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        const arbeidsgiver = enArbeidsgiver();
        (useGraderteAndreYtelser as Mock).mockReturnValue([
            {
                yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                versjon: 'en-versjon',
                dager: [
                    {
                        dato: '2022-01-03',
                        andreYtelserGrader: { FORELDREPENGER: 40 },
                        sykdomsgrad: 50,
                        arbeidsgrad: 10,
                        sykdomsgradFørFordeling: 90,
                    },
                ],
                events: [],
            },
        ]);

        render(
            <OverstyrbarUtbetaling
                inntektsforhold={arbeidsgiver}
                person={enPerson()}
                dager={dager}
                periode={enBeregnetPeriode({ fom: '2022-01-01', tom: '2022-01-31' })}
            />,
        );

        expect(screen.getByRole('columnheader', { name: 'Andre ytelser' })).toBeVisible();
        expect(screen.getByText('40 %')).toBeVisible();
        expect(screen.getByText('Foreldrepenger')).toBeVisible();
    });

    test('vurderer oppholdskravet for de markerte dagene', async () => {
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));
        const checkboxes = screen.getAllByRole('checkbox');
        await userEvent.click(checkboxes[1]!);
        await userEvent.click(checkboxes[2]!);
        await userEvent.click(screen.getByRole('button', { name: 'Vurder oppholdskrav' }));

        expect(screen.getByRole('dialog', { name: 'Vurder oppholdskrav' })).toBeVisible();
        expect(screen.getByText('01.01.2022, 02.01.2022')).toBeVisible();
    });

    test('vurderer oppholdskravet også i perioder som ikke er beregnet', async () => {
        const periode = enUberegnetPeriode({ fom: '2022-01-01', tom: '2022-01-31' });
        render(
            <OverstyrbarUtbetaling
                inntektsforhold={enArbeidsgiver()}
                person={enPerson()}
                dager={dager}
                periode={periode}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));
        await userEvent.click(screen.getAllByRole('checkbox')[1]!);

        expect(screen.getByRole('button', { name: 'Vurder oppholdskrav' })).toBeEnabled();
    });

    test('sperrer vurdering av oppholdskravet når endringer av dager ikke er sendt', async () => {
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));
        await userEvent.click(screen.getAllByRole('checkbox')[1]!);
        await userEvent.selectOptions(screen.getByTestId('dagtypevelger'), 'Ferie');
        await userEvent.click(screen.getByTestId('endre'));

        expect(screen.getByRole('button', { name: 'Vurder oppholdskrav' })).toBeDisabled();
    });

    test('endrer ikke dager som er avslått etter oppholdskravet', async () => {
        renderOverstyring(
            new Map([
                [
                    '2022-01-01',
                    getUtbetalingstabellDag({ dato: '2022-01-01', begrunnelser: [ApiBegrunnelse.OPPHOLDSKRAV] }),
                ],
            ]),
        );

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));
        await userEvent.click(screen.getAllByRole('checkbox')[1]!);
        await userEvent.click(screen.getByTestId('endre'));

        expect(
            await screen.findByText(
                'Dagtype: 01.01.2022 er avslått etter oppholdskravet. Gjør om vurderingen av oppholdskravet før du endrer dagen.',
            ),
        ).toBeVisible();
        expect(screen.getByTestId('oppdater')).toBeDisabled();
    });

    test('lukker endring av dager når oppholdskravet er vurdert', async () => {
        renderOverstyring(dager);

        await userEvent.click(screen.getByRole('button', { name: 'Endre dagtype' }));
        await userEvent.click(screen.getAllByRole('checkbox')[1]!);
        await userEvent.click(screen.getByRole('button', { name: 'Vurder oppholdskrav' }));
        const dialog = within(screen.getByRole('dialog', { name: 'Vurder oppholdskrav' }));
        await userEvent.click(
            within(dialog.getByRole('radiogroup', { name: 'Er personen EØS-borger?' })).getByRole('radio', {
                name: 'Ja',
            }),
        );
        await userEvent.click(
            within(
                dialog.getByRole('radiogroup', {
                    name: 'Oppholdt personen seg i Norge, et annet EØS-land eller et avtaleland?',
                }),
            ).getByRole('radio', { name: 'Ja' }),
        );
        await userEvent.type(dialog.getByRole('textbox', { name: /Begrunnelse/ }), 'Opphold i Norge');
        await userEvent.click(dialog.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));
        await userEvent.click(dialog.getByRole('button', { name: 'Lagre' }));

        expect(screen.queryByRole('dialog', { name: 'Vurder oppholdskrav' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurder oppholdskrav' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Endre dagtype' })).toBeVisible();
    });
});

function lagOverstyring(dager: Map<string, Utbetalingstabelldag>) {
    const periode = enBeregnetPeriode({ fom: '2022-01-01', tom: '2022-01-31' }).medSkjæringstidspunkt('2022-01-01');
    return (
        <OverstyrbarUtbetaling
            inntektsforhold={enArbeidsgiver().medPerioder([periode])}
            person={enPerson()}
            dager={dager}
            periode={periode}
        />
    );
}

function renderOverstyring(dager: Map<string, Utbetalingstabelldag>) {
    return render(lagOverstyring(dager));
}
