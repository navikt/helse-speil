import { Mock, vi } from 'vitest';

import { useGetOverstyringerForPerson } from '@io/rest/generated/personer/personer';
import {
    ApiDagoverstyring,
    ApiDagtype,
    ApiHandlingType,
    ApiPeriodetilstand,
    ApiSaksbehandlerhandling,
    ApiSaksbildeVarselstatus,
    ApiVarselDTO,
} from '@io/rest/generated/spesialist.schemas';
import { useInntektOgRefusjon } from '@state/overstyring';
import { useHentSaksbehandlerhandlinger } from '@state/saksbehandlerhandlinger';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { useNyttVarseldesign } from '@state/toggles';
import { useHarBeslutteroppgave, useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enTotrinnsvurdering } from '@test-data/totrinnsvurdering';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { SaksbildevarslerOgBeskjeder } from './SaksbildevarslerOgBeskjeder';

vi.mock('@state/overstyring');
vi.mock('@io/rest/generated/personer/personer', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/personer/personer')>()),
    useGetOverstyringerForPerson: vi.fn(),
}));
vi.mock('@state/tilkommenInntekt');
vi.mock('@state/totrinnsvurdering');
vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttVarseldesign: vi.fn(),
}));
vi.mock('@state/saksbehandlerhandlinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/saksbehandlerhandlinger')>()),
    useHentSaksbehandlerhandlinger: vi.fn(),
}));

describe('SaksbildevarslerOgBeskjeder', () => {
    beforeEach(() => {
        (useHentTilkommenInntektQuery as Mock).mockReturnValue({ data: [] });
        (useHentSaksbehandlerhandlinger as Mock).mockReturnValue({ data: [] });
        (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(null);
        (useHarBeslutteroppgave as Mock).mockReturnValue(false);
        (useGetOverstyringerForPerson as Mock).mockReturnValue({ data: { overstyringer: [] } });
        (useNyttVarseldesign as Mock).mockReturnValue(false);
    });

    it('skal kaste feil om beregnet periode mangler skjæringstidspunkt', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const periode = enBeregnetPeriode({ vilkarsgrunnlagId: undefined });

        expect(() => render(<SaksbildevarslerOgBeskjeder person={enPerson()} periode={periode} />)).toThrow();
        consoleErrorSpy.mockRestore();
    });
    it('viser varslene for uberegnet periode', () => {
        render(
            <SaksbildevarslerOgBeskjeder
                person={enPerson()}
                periode={enUberegnetPeriode({ varsler: [getVarsel()] })}
            />,
        );

        expect(screen.getByText('Et varsel')).toBeInTheDocument();
    });
    it('viser annulleringsbeskjed for annullert beregnet periode', () => {
        render(
            <SaksbildevarslerOgBeskjeder
                person={enPerson()}
                periode={enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.Annullert })}
            />,
        );

        expect(screen.getByText('Utbetalingen er annullert')).toBeInTheDocument();
    });
    it('viser annulleringsbeskjed for beregnet periode til annullering', () => {
        render(
            <SaksbildevarslerOgBeskjeder
                person={enPerson()}
                periode={enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.TilAnnullering })}
            />,
        );

        expect(screen.getByText('Utbetalingen er sendt til annullering')).toBeInTheDocument();
    });
    it('viser beslutterkontroll for beregnet periode', () => {
        medBeslutteroppgave();
        (useGetOverstyringerForPerson as Mock).mockReturnValue({ data: { overstyringer: [enDagoverstyring] } });
        const periode = enBeregnetPeriode({
            periodetilstand: ApiPeriodetilstand.TilGodkjenning,
        });
        render(
            <SaksbildevarslerOgBeskjeder
                person={enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            organisasjonsnummer: '987654321',
                            behandlinger: [enBehandling({ perioder: [periode] })],
                        }),
                    ],
                })}
                periode={periode}
            />,
        );

        const kontrollerElement = screen.getByText('Kontroller:');
        expect(kontrollerElement).toBeVisible();
        const overstyringAvDagerElement = screen.getByText('Overstyring av dager');
        expect(overstyringAvDagerElement).toBeVisible();
        expect(screen.getByRole('list', { name: 'Kontroller:' })).toContainElement(overstyringAvDagerElement);
    });
    it.each([
        [ApiHandlingType.MANUELT_VURDERT_OPPTJENING, 'Manuell vurdering av opptjening'],
        [ApiHandlingType.GRADERTE_ANDRE_YTELSER_ENDRET, 'Endring av graderte andre ytelser'],
    ])('viser kontrollrad for %s i aktiv totrinnsvurdering', (handlingType, tekst) => {
        (useHentSaksbehandlerhandlinger as Mock).mockReturnValue({
            data: [enSaksbehandlerhandling({ handlingType, erDelAvAktivTotrinnsvurdering: true })],
        });
        medBeslutteroppgave();
        const periode = enBeregnetPeriodeTilGodkjenning();
        render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

        const handlingElement = screen.getByText(tekst);
        expect(screen.getByRole('list', { name: 'Kontroller:' })).toContainElement(handlingElement);
    });

    it('viser ikke kontrollrad når ingen saksbehandlerhandling er del av aktiv totrinnsvurdering', () => {
        (useHentSaksbehandlerhandlinger as Mock).mockReturnValue({
            data: [enSaksbehandlerhandling({ erDelAvAktivTotrinnsvurdering: false })],
        });
        medBeslutteroppgave();
        const periode = enBeregnetPeriodeTilGodkjenning();
        render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

        expect(screen.queryByText('Manuell vurdering av opptjening')).not.toBeInTheDocument();
    });

    it('viser beskjed om å kalkulere endringer for ghost periode', () => {
        const arbeidsgiver = enArbeidsgiver();
        const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
        const periode = enGhostPeriode();

        (useInntektOgRefusjon as Mock).mockReturnValue({
            aktørId: person.aktorId,
            fødselsnummer: person.fodselsnummer,
            skjæringstidspunkt: periode.skjaeringstidspunkt,
            arbeidsgivere: [
                {
                    organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                    månedligInntekt: 100000,
                    fraMånedligInntekt: 0,
                    refusjonsopplysninger: [],
                    fraRefusjonsopplysninger: [],
                    forklaring: 'forklar',
                    begrunnelse: 'begrunnelse',
                },
            ],
        });

        render(<SaksbildevarslerOgBeskjeder person={person} periode={periode} />);

        expect(
            screen.getByText('Endringene for sykepengegrunnlag må kalkuleres før du sender oppgaven til godkjenning.'),
        ).toBeInTheDocument();
    });

    it('viser feilbeskjed når utbetalingen har feilet', () => {
        const periode = enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.UtbetalingFeilet });
        render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });

    it('viser statusbeskjed når perioden venter på inntektsmelding', () => {
        const periode = enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.AvventerInntektsopplysninger });
        render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

        expect(screen.getByText('Ikke klar til behandling - venter på inntektsmelding')).toBeVisible();
    });

    it('viser beslutterkontroll for tilkommen inntekt', () => {
        (useHentTilkommenInntektQuery as Mock).mockReturnValue({
            data: [{ inntekter: [{ erDelAvAktivTotrinnsvurdering: true }] }],
        });
        medBeslutteroppgave();
        const periode = enBeregnetPeriodeTilGodkjenning();
        render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

        expect(screen.getByRole('list', { name: 'Kontroller:' })).toContainElement(
            screen.getByText('Tilkommen inntekt'),
        );
    });

    it('viser varslene til perioden', () => {
        const periode = enUtbetaltPeriode([
            getVarsel(),
            { ...getVarsel(), id: 'et-annet-varsel', tittel: 'Et annet varsel' },
        ]);
        render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

        expect(screen.getByText('Et varsel')).toBeVisible();
        expect(screen.getByText('Et annet varsel')).toBeVisible();
    });

    describe('med nytt varseldesign', () => {
        beforeEach(() => {
            (useNyttVarseldesign as Mock).mockReturnValue(true);
        });

        it('viser saksbildebeskjeder utenfor varslene', () => {
            (useHentTilkommenInntektQuery as Mock).mockReturnValue({
                data: [{ inntekter: [{ erDelAvAktivTotrinnsvurdering: true }] }],
            });
            medBeslutteroppgave();
            const periode = enBeregnetPeriode({
                periodetilstand: ApiPeriodetilstand.UtbetalingFeilet,
                varsler: [getVarsel()],
            });
            render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

            const varslene = screen.getByRole('region', { name: 'Varsler' });
            expect(varslene).toContainElement(screen.getByText('Et varsel'));
            expect(varslene).not.toContainElement(screen.getByText('Utbetalingen feilet.'));
            expect(varslene).not.toContainElement(screen.getByText('Tilkommen inntekt'));
        });

        it('viser ikke varslene når perioden ikke har varsler', () => {
            const periode = enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.AvventerInntektsopplysninger });
            render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

            expect(screen.getByText('Ikke klar til behandling - venter på inntektsmelding')).toBeVisible();
            expect(screen.queryByRole('region', { name: 'Varsler' })).not.toBeInTheDocument();
        });

        it('viser varslene sortert etter kode uten varsler som ikke skal vises', async () => {
            const periode = enUtbetaltPeriode([
                { ...getVarsel(), id: 'b', kode: 'RV_IM_2', tittel: 'Andre varsel' },
                { ...getVarsel(), id: 'skjult', kode: 'SB_EX_2', tittel: 'Skjult varsel' },
                { ...getVarsel(), id: 'a', kode: 'RV_IM_1', tittel: 'Første varsel' },
            ]);
            render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

            const varslene = screen.getByRole('region', { name: 'Varsler' });
            expect(varslene).toHaveTextContent('Varsler (2)');
            await userEvent.click(within(varslene).getAllByRole('button')[0]!);
            expect(
                within(varslene)
                    .getAllByRole('heading', { level: 3 })
                    .map((tittel) => tittel.textContent),
            ).toEqual([expect.stringContaining('Første varsel'), expect.stringContaining('Andre varsel')]);
            expect(screen.queryByText('Skjult varsel')).not.toBeInTheDocument();
        });

        it('viser ikke varslene når perioden bare har varsler som ikke skal vises', () => {
            const periode = enUtbetaltPeriode([{ ...getVarsel(), kode: 'SB_EX_2' }]);
            render(<SaksbildevarslerOgBeskjeder person={enPersonMedPeriode(periode)} periode={periode} />);

            expect(screen.queryByRole('region', { name: 'Varsler' })).not.toBeInTheDocument();
        });
    });
});

const getVarsel = (status?: ApiSaksbildeVarselstatus): ApiVarselDTO => {
    return {
        id: '5d372089-5999-43ad-b4b6-06b8c913006a',
        definisjonId: 'en verdi',
        behandlingId: 'en verdi',
        opprettet: '2020-01-01',
        kode: 'RV_IM_1',
        tittel: 'Et varsel',
        vurdering: status
            ? {
                  ident: 'en ident',
                  status: status,
                  tidsstempel: 'et tidsstempel',
              }
            : null,
        forklaring: null,
        handling: null,
    };
};

const enDagoverstyring: ApiDagoverstyring = {
    type: 'ApiDagoverstyring',
    vedtaksperiodeId: '',
    hendelseId: 'en-id',
    timestamp: '2020-01-01',
    begrunnelse: 'Fordi',
    dager: [
        {
            dato: '2020-01-02',
            type: ApiDagtype.Sykedag,
            grad: 80,
            fraGrad: null,
            fraType: null,
        },
    ],
    saksbehandler: {
        navn: 'et-navn',
        ident: 'en-ident',
    },
    ferdigstilt: false,
    organisasjonsnummer: '987654321',
};

function medBeslutteroppgave() {
    (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering({ erBeslutteroppgave: true }));
    (useHarBeslutteroppgave as Mock).mockReturnValue(true);
}

function enBeregnetPeriodeTilGodkjenning() {
    return enBeregnetPeriode({
        periodetilstand: ApiPeriodetilstand.TilGodkjenning,
    });
}

function enUtbetaltPeriode(varsler: ApiVarselDTO[]) {
    return enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.Utbetalt, varsler });
}

function enPersonMedPeriode(periode: ReturnType<typeof enBeregnetPeriode>) {
    return enPerson({
        arbeidsgivere: [enArbeidsgiver({ behandlinger: [enBehandling({ perioder: [periode] })] })],
    });
}

function enSaksbehandlerhandling(overrides?: Partial<ApiSaksbehandlerhandling>): ApiSaksbehandlerhandling {
    return {
        handlingId: 'handling-id',
        handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
        saksbehandlerIdent: 'S123456',
        tidspunkt: '2020-01-01T12:00:00',
        skjæringstidspunkt: null,
        behandlingId: null,
        erDelAvAktivTotrinnsvurdering: false,
        ...overrides,
    };
}
