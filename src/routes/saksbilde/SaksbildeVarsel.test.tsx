import { Dagoverstyring, Dagtype, Periodetilstand, VarselDto, Varselstatus } from '@io/graphql';
import { SaksbildeVarsel } from '@saksbilde/SaksbildeVarsel';
import { useInntektOgRefusjon } from '@state/overstyring';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enOppgave } from '@test-data/oppgave';
import {
    enBeregnetPeriode,
    enGhostPeriode,
    enNyttInntektsforholdPeriode,
    enUberegnetPeriode,
} from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

jest.mock('@state/overstyring');

describe('SaksbildeVarsel', () => {
    it('skal kaste feil om periode mangler skjæringstidspunkt', () => {
        const periode = enUberegnetPeriode({ skjaeringstidspunkt: undefined });

        expect(() => render(<SaksbildeVarsel person={enPerson()} periode={periode} />)).toThrow();
    });
    it('skal kaste feil om ikke uberegnet periode mangler skjæringstidspunkt', () => {
        const periode = enBeregnetPeriode({ vilkarsgrunnlagId: undefined });

        expect(() => render(<SaksbildeVarsel person={enPerson()} periode={periode} />)).toThrow();
    });
    it('skal rendre eget varsel for uberegnet periode', () => {
        render(<SaksbildeVarsel person={enPerson()} periode={enUberegnetPeriode({ varsler: [getVarsel()] })} />);

        expect(screen.getByText('Et varsel')).toBeInTheDocument();
    });
    it('skal rendre eget varsel for annullert beregnet periode', () => {
        render(
            <SaksbildeVarsel
                person={enPerson()}
                periode={enBeregnetPeriode({ periodetilstand: Periodetilstand.Annullert })}
            />,
        );

        expect(screen.getByText('Utbetalingen er annullert')).toBeInTheDocument();
    });
    it('skal rendre eget varsel for beregnet periode til annullering', () => {
        render(
            <SaksbildeVarsel
                person={enPerson()}
                periode={enBeregnetPeriode({ periodetilstand: Periodetilstand.TilAnnullering })}
            />,
        );

        expect(screen.getByText('Utbetalingen er sendt til annullering')).toBeInTheDocument();
    });
    it('skal rendre eget varsel for beregnet periode', () => {
        render(
            <SaksbildeVarsel
                person={enPerson({
                    arbeidsgivere: [
                        enArbeidsgiver({
                            overstyringer: [enDagoverstyring],
                        }),
                    ],
                })}
                periode={enBeregnetPeriode({
                    periodetilstand: Periodetilstand.TilGodkjenning,
                    totrinnsvurdering: {
                        __typename: 'Totrinnsvurdering',
                        erBeslutteroppgave: true,
                        erRetur: false,
                        saksbehandler: null,
                        beslutter: null,
                    },
                    oppgave: enOppgave(),
                })}
            />,
        );

        expect(screen.getByText('Beslutteroppgave: Overstyring av dager')).toBeInTheDocument();
    });
    it('skal rendre eget varsel for ghost periode', () => {
        const arbeidsgiver = enArbeidsgiver();
        const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
        const periode = enGhostPeriode();

        (useInntektOgRefusjon as jest.Mock).mockReturnValue({
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

        render(<SaksbildeVarsel person={person} periode={periode} />);

        expect(
            screen.getByText('Endringene for sykepengegrunnlag må kalkuleres før du sender saken til godkjenning.'),
        ).toBeInTheDocument();
    });
    it('skal rendre eget varsel for tilkommen inntekt periode', () => {
        const arbeidsgiver = enArbeidsgiver();
        const person = enPerson({ arbeidsgivere: [arbeidsgiver] });
        const periode = enNyttInntektsforholdPeriode();

        (useInntektOgRefusjon as jest.Mock).mockReturnValue({
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

        render(<SaksbildeVarsel person={person} periode={periode} />);

        expect(
            screen.getByText('Endringene for sykepengegrunnlag må kalkuleres før du sender saken til godkjenning.'),
        ).toBeInTheDocument();
    });
});

const getVarsel = (status?: Varselstatus): VarselDto => {
    return {
        __typename: 'VarselDTO',
        definisjonId: 'en verdi',
        generasjonId: 'en verdi',
        opprettet: '2020-01-01',
        kode: 'RV_IM_1',
        tittel: 'Et varsel',
        vurdering: status
            ? {
                  __typename: 'VarselvurderingDTO',
                  ident: 'en ident',
                  status: status,
                  tidsstempel: 'et tidsstempel',
              }
            : null,
        forklaring: null,
        handling: null,
    };
};

const enDagoverstyring: Dagoverstyring = {
    __typename: 'Dagoverstyring',
    hendelseId: 'en-id',
    timestamp: '2020-01-01',
    begrunnelse: 'Fordi',
    dager: [
        {
            __typename: 'OverstyrtDag',
            dato: '2020-01-02',
            type: Dagtype.Sykedag,
            grad: 80,
            fraGrad: null,
            fraType: null,
        },
    ],
    saksbehandler: {
        __typename: 'Saksbehandler',
        navn: 'et-navn',
        ident: 'en-ident',
    },
    ferdigstilt: false,
};
