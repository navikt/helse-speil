import { Mock, vi } from 'vitest';

import {
    ApiDagoverstyring,
    ApiDagtype,
    ApiHandlingType,
    ApiPeriodetilstand,
    ApiSaksbehandlerhandling,
    ApiSaksbildeVarselstatus,
    ApiVarselDTO,
} from '@io/rest/generated/spesialist.schemas';
import { SaksbildevarselContainer } from '@saksbilde/SaksbildevarselContainer';
import { useInntektOgRefusjon } from '@state/overstyring';
import { useHentSaksbehandlerhandlinger } from '@state/saksbehandlerhandlinger';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enGhostPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

vi.mock('@state/overstyring');
vi.mock('@state/tilkommenInntekt');
vi.mock('@state/saksbehandlerhandlinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/saksbehandlerhandlinger')>()),
    useHentSaksbehandlerhandlinger: vi.fn(),
}));

describe('SaksbildevarselContainer', () => {
    beforeEach(() => {
        (useHentTilkommenInntektQuery as Mock).mockReturnValue({ data: [] });
        (useHentSaksbehandlerhandlinger as Mock).mockReturnValue({ data: [] });
    });

    it('skal kaste feil om beregnet periode mangler skjæringstidspunkt', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const periode = enBeregnetPeriode({ vilkarsgrunnlagId: undefined });

        expect(() => render(<SaksbildevarselContainer person={enPerson()} periode={periode} />)).toThrow();
        consoleErrorSpy.mockRestore();
    });
    it('skal rendre eget varsel for uberegnet periode', () => {
        render(
            <SaksbildevarselContainer person={enPerson()} periode={enUberegnetPeriode({ varsler: [getVarsel()] })} />,
        );

        expect(screen.getByText('Et varsel')).toBeInTheDocument();
    });
    it('skal rendre eget varsel for annullert beregnet periode', () => {
        render(
            <SaksbildevarselContainer
                person={enPerson()}
                periode={enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.Annullert })}
            />,
        );

        expect(screen.getByText('Utbetalingen er annullert')).toBeInTheDocument();
    });
    it('skal rendre eget varsel for beregnet periode til annullering', () => {
        render(
            <SaksbildevarselContainer
                person={enPerson()}
                periode={enBeregnetPeriode({ periodetilstand: ApiPeriodetilstand.TilAnnullering })}
            />,
        );

        expect(screen.getByText('Utbetalingen er sendt til annullering')).toBeInTheDocument();
    });
    it('skal rendre eget varsel for beregnet periode', () => {
        const periode = enBeregnetPeriode({
            periodetilstand: ApiPeriodetilstand.TilGodkjenning,
            totrinnsvurdering: {
                erBeslutteroppgave: true,
                erRetur: false,
                saksbehandler: null,
                beslutter: null,
            },
            oppgave: enOppgave(),
        });
        render(
            <SaksbildevarselContainer
                person={enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            overstyringer: [enDagoverstyring],
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
        expect(kontrollerElement.parentElement).toContainElement(overstyringAvDagerElement);
    });
    it('viser kontrollrad når en saksbehandlerhandling er del av aktiv totrinnsvurdering', () => {
        (useHentSaksbehandlerhandlinger as Mock).mockReturnValue({
            data: [enSaksbehandlerhandling({ erDelAvAktivTotrinnsvurdering: true })],
        });
        const periode = enBeregnetPeriodeMedTotrinnsvurdering();
        render(<SaksbildevarselContainer person={enPersonMedPeriode(periode)} periode={periode} />);

        const kontrollerElement = screen.getByText('Kontroller:');
        const handlingElement = screen.getByText('Manuell vurdering av opptjening');
        expect(kontrollerElement.parentElement).toContainElement(handlingElement);
    });

    it('viser ikke kontrollrad når ingen saksbehandlerhandling er del av aktiv totrinnsvurdering', () => {
        (useHentSaksbehandlerhandlinger as Mock).mockReturnValue({
            data: [enSaksbehandlerhandling({ erDelAvAktivTotrinnsvurdering: false })],
        });
        const periode = enBeregnetPeriodeMedTotrinnsvurdering();
        render(<SaksbildevarselContainer person={enPersonMedPeriode(periode)} periode={periode} />);

        expect(screen.queryByText('Manuell vurdering av opptjening')).not.toBeInTheDocument();
    });

    it('skal rendre eget varsel for ghost periode', () => {
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

        render(<SaksbildevarselContainer person={person} periode={periode} />);

        expect(
            screen.getByText('Endringene for sykepengegrunnlag må kalkuleres før du sender oppgaven til godkjenning.'),
        ).toBeInTheDocument();
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
};

function enBeregnetPeriodeMedTotrinnsvurdering() {
    return enBeregnetPeriode({
        periodetilstand: ApiPeriodetilstand.TilGodkjenning,
        totrinnsvurdering: {
            erBeslutteroppgave: true,
            erRetur: false,
            saksbehandler: null,
            beslutter: null,
        },
        oppgave: enOppgave(),
    });
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
