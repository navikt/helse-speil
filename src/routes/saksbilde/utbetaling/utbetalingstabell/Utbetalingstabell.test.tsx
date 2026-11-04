import { Mock, vi } from 'vitest';

import {
    ApiGraderteAndreYtelserDag,
    ApiGraderteAndreYtelserEvent,
    ApiYrkesaktivitetstype,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { ApiKildetype } from '@io/rest/generated/spesialist.schemas';
import { enPerson } from '@test-data/person';
import { render } from '@test-utils';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';

import { Utbetalingstabell } from './Utbetalingstabell';
import { Helgedag, Sykedag } from './utbetalingstabelldager';

vi.mock('@utils/featureToggles', () => ({ useSkalSeGraderteAndreYtelser: vi.fn() }));

vi.mock('./useAlderVedSkjæringstidspunkt', () => ({
    useAlderVedSkjæringstidspunkt: () => 30,
}));

const enUtbetalingstabelldag = (dato: string, overrides?: Partial<Utbetalingstabelldag>): Utbetalingstabelldag => ({
    dato: dato,
    kilde: { id: 'Sasdadgf', type: ApiKildetype.INNTEKTSMELDING },
    dag: Sykedag,
    erAGP: false,
    erVentetid: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    grad: 100,
    dagerIgjen: 100,
    overstyringer: [],
    totalGradering: 100,
    arbeidsgiverbeløp: 999,
    personbeløp: 1234,
    begrunnelser: [],
    ...overrides,
});

const dager = new Map<string, Utbetalingstabelldag>([
    ['2022-01-01', enUtbetalingstabelldag('2022-01-01')],
    ['2022-01-02', enUtbetalingstabelldag('2022-01-02')],
    ['2022-01-03', enUtbetalingstabelldag('2022-01-03')],
    ['2022-01-04', enUtbetalingstabelldag('2022-01-04')],
    ['2022-01-05', enUtbetalingstabelldag('2022-01-05')],
]);

describe('Utbetalingstabell', () => {
    beforeEach(() => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(false);
    });

    it('rendrer headere, totalrad og dagrader', () => {
        render(
            <Utbetalingstabell
                fom="2021-01-01"
                tom="2021-01-10"
                dager={dager}
                person={enPerson()}
                erSelvstendigNæring={false}
            />,
        );

        expect(screen.getAllByRole('row')).toHaveLength(7);
    });

    it('viser ikke kolonnen for andre ytelser uten togglen', () => {
        rendrerTabell([enGradertAnnenYtelseDag('2022-01-03')]);

        expect(screen.queryByRole('columnheader', { name: 'Andre ytelser' })).not.toBeInTheDocument();
        expect(screen.queryByText('Pleiepenger, foreldrepenger')).not.toBeInTheDocument();
    });

    describe('med togglen for graderte andre ytelser', () => {
        beforeEach(() => {
            (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        });

        it('viser kolonnen «Andre ytelser» etter Grad', () => {
            rendrerTabell([]);

            const headere = screen.getAllByRole('columnheader').map((header) => header.textContent);
            expect(headere.indexOf('Andre ytelser')).toBe(headere.indexOf('Grad') + 1);
            expect(screen.getAllByRole('row').map((rad) => rad.children.length)).toSatisfy((antall: number[]) =>
                antall.every((it) => it === antall[0]),
            );
        });

        it('viser den samlede graden og ytelsene for en dag med fordeling', () => {
            rendrerTabell([enGradertAnnenYtelseDag('2022-01-03')]);

            const rad = radFor('03.01.2022');
            expect(within(rad).getByText('40 %')).toBeVisible();
            expect(within(rad).getByText('Pleiepenger, foreldrepenger')).toBeVisible();
        });

        it('viser «-» for dager uten fordeling og ingenting for helgedager', () => {
            rendrerTabell([enGradertAnnenYtelseDag('2022-01-03', {})], {
                ['2022-01-01']: enUtbetalingstabelldag('2022-01-01', { dag: Helgedag }),
            });

            expect(within(radFor('03.01.2022')).getByText('-')).toBeVisible();
            expect(within(radFor('04.01.2022')).getByText('-')).toBeVisible();
            expect(within(radFor('01.01.2022')).queryByText('-')).not.toBeInTheDocument();
        });

        it('viser endringsloggen bare for dager med endringer av fordelingen', async () => {
            const dag = enGradertAnnenYtelseDag('2022-01-03');
            rendrerTabell([dag], {}, [enEvent([{ ...dag, fraAndreYtelserGrader: null }])]);

            expect(within(radFor('04.01.2022')).queryByRole('button', { name: 'Vis endringslogg' })).toBeNull();
            await userEvent.click(within(radFor('03.01.2022')).getByRole('button', { name: 'Vis endringslogg' }));

            const dialog = await screen.findByRole('dialog');
            expect(within(dialog).getByText('Pleiepenger 30 %, Foreldrepenger 10 %')).toBeVisible();
            expect(within(dialog).getByText('Et notat')).toBeVisible();
        });

        it('beholder endringsloggen for overstyringer av tidslinjen på samme dag', async () => {
            const dag = enGradertAnnenYtelseDag('2022-01-03');
            rendrerTabell(
                [dag],
                {
                    ['2022-01-03']: enUtbetalingstabelldag('2022-01-03', {
                        kilde: { id: 'en-overstyring', type: ApiKildetype.SAKSBEHANDLER },
                        overstyringer: [
                            {
                                vedtaksperiodeId: 'vedtaksperiodeId',
                                hendelseId: 'hendelseId',
                                begrunnelse: 'En begrunnelse for overstyringen',
                                saksbehandler: { ident: 'B123456', navn: 'En saksbehandler' },
                                timestamp: '2022-02-01T10:00:00',
                                dag: Sykedag,
                                dato: '2022-01-03',
                                ferdigstilt: false,
                            },
                        ],
                    }),
                },
                [enEvent([dag])],
            );

            const [andreYtelser, kilde] = within(radFor('03.01.2022')).getAllByRole('button', {
                name: 'Vis endringslogg',
            });
            expect(andreYtelser).toBeDefined();
            await userEvent.click(kilde!);

            expect(await screen.findByText('En begrunnelse for overstyringen')).toBeVisible();
            expect(screen.queryByText('Et notat')).not.toBeInTheDocument();
        });
    });
});

function rendrerTabell(
    graderteAndreYtelserDager: ApiGraderteAndreYtelserDag[],
    overstyrteDager: Record<string, Utbetalingstabelldag> = {},
    events: ApiGraderteAndreYtelserEvent[] = [],
) {
    render(
        <Utbetalingstabell
            fom="2022-01-01"
            tom="2022-01-05"
            dager={new Map([...dager, ...Object.entries(overstyrteDager)])}
            person={enPerson()}
            erSelvstendigNæring={false}
            graderteAndreYtelser={{
                yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
                organisasjonsnummer: '123456789',
                versjon: 'en-versjon',
                dager: graderteAndreYtelserDager,
                events,
            }}
        />,
    );
}

function radFor(dato: string): HTMLElement {
    return screen.getByText(dato).closest('tr')!;
}

function enGradertAnnenYtelseDag(
    dato: string,
    andreYtelserGrader: Record<string, number> = { PLEIEPENGER: 30, FORELDREPENGER: 10 },
): ApiGraderteAndreYtelserDag {
    return { dato, andreYtelserGrader, sykdomsgrad: 50, arbeidsgrad: 10, sykdomsgradFørFordeling: 60 };
}

function enEvent(dager: ApiGraderteAndreYtelserEvent['dager']): ApiGraderteAndreYtelserEvent {
    return {
        versjon: 'en-versjon',
        tidspunkt: '2022-02-02T10:00:00',
        utfortAvSaksbehandlerIdent: 'A123456',
        notatTilBeslutter: 'Et notat',
        dager,
    };
}
