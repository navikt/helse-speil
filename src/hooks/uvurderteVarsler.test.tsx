import { useHarUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import {
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Inntektstype,
    Periodetilstand,
    Periodetype,
    Periodevilkar,
    Sykdomsdagtype,
    Utbetalingsdagtype,
    Utbetalingstatus,
    Utbetalingtype,
    VarselDto,
    Varselstatus,
} from '@io/graphql';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

const getFetchedBeregnetPeriode = (fom: string, tom: string, varsel?: VarselDto): BeregnetPeriodeFragment => {
    return {
        __typename: 'BeregnetPeriode',
        behandlingId: 'EN_BEHANDLING_ID',
        beregningId: 'EN_ID',
        erForkastet: false,
        fom: fom,
        tom: tom,
        handlinger: [],
        hendelser: [],
        id: 'EN_ID',
        inntektstype: Inntektstype.Enarbeidsgiver,
        maksdato: '2023-01-01',
        notater: [],
        opprettet: '2020-01-01',
        periodehistorikk: [],
        periodetilstand: Periodetilstand.TilGodkjenning,
        periodetype: Periodetype.Forstegangsbehandling,
        periodevilkar: {} as Periodevilkar,
        skjaeringstidspunkt: 'ET_SKJAERINGSTIDSPUNKT',
        tidslinje: [
            {
                __typename: 'Dag',
                dato: '2022-01-01',
                utbetalingsinfo: null,
                begrunnelser: null,
                grad: null,
                kilde: {} as Kilde,
                sykdomsdagtype: Sykdomsdagtype.Arbeidsgiverdag,
                utbetalingsdagtype: Utbetalingsdagtype.Arbeidsgiverperiodedag,
            },
        ],
        utbetaling: {
            __typename: 'Utbetaling',
            arbeidsgiverFagsystemId: 'EN_ID',
            arbeidsgiverNettoBelop: 0,
            id: 'EN_ID',
            personFagsystemId: 'EN_ID',
            personNettoBelop: 0,
            status: Utbetalingstatus.Ubetalt,
            type: Utbetalingtype.Utbetaling,
            arbeidsgiversimulering: null,
            personsimulering: null,
            vurdering: null,
        },
        varsler: varsel ? [varsel] : [],
        vedtaksperiodeId: 'EN_ID',
        egenskaper: [],
        avslag: [],
        risikovurdering: null,
        forbrukteSykedager: null,
        gjenstaendeSykedager: null,
        oppgave: null,
        paVent: null,
        totrinnsvurdering: null,
        vilkarsgrunnlagId: null,
    };
};

const getVarsel = (status?: Varselstatus): VarselDto => {
    return {
        __typename: 'VarselDTO',
        definisjonId: 'en verdi',
        generasjonId: 'en verdi',
        opprettet: '2020-01-01',
        kode: 'RV_IM_1',
        tittel: '',
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

const getArbeidsgiver = (
    organisasjonsnummer: string,
    generasjoner: ArbeidsgiverFragment['generasjoner'],
): ArbeidsgiverFragment => {
    return {
        __typename: 'Arbeidsgiver',
        arbeidsforhold: [],
        bransjer: [],
        generasjoner: generasjoner,
        ghostPerioder: [],
        navn: 'EN_ARBEIDSGIVER',
        organisasjonsnummer: organisasjonsnummer,
        overstyringer: [],
        inntekterFraAordningen: [],
    };
};

const getGenerasjoner = (periods: BeregnetPeriodeFragment[]) => {
    return [
        {
            __typename: 'Generasjon' as const,
            id: 'EN_ID',
            perioder: periods,
        },
    ];
};

describe('useUvurderteVarslerpåEllerFør', () => {
    it('Arbeidsgiver uten generasjoner filtreres vekk før sjekk av uvurderte varsler', () => {
        const period: BeregnetPeriodeFragment = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ArbeidsgiverFragment[] = [
            getArbeidsgiver('et orgnr1', []),
            getArbeidsgiver(
                'et annet orgnr',
                getGenerasjoner([
                    getFetchedBeregnetPeriode('2017-12-01', '2017-12-31'),
                    getFetchedBeregnetPeriode('2018-01-01', '2018-01-31'),
                    getFetchedBeregnetPeriode('2018-02-01', '2018-02-28'),
                ]),
            ),
        ];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(period, arbeidsgivere));

        expect(result.current).toEqual(false);
    });
    it('Kan godkjenne varsler dersom det ikke finnes uvurderte varsler', () => {
        const period: BeregnetPeriodeFragment = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ArbeidsgiverFragment[] = [
            getArbeidsgiver('et orgnr', getGenerasjoner([period])),
            getArbeidsgiver(
                'et annet orgnr',
                getGenerasjoner([
                    getFetchedBeregnetPeriode('2017-12-01', '2017-12-31'),
                    getFetchedBeregnetPeriode('2018-01-01', '2018-01-31'),
                    getFetchedBeregnetPeriode('2018-02-01', '2018-02-28'),
                ]),
            ),
        ];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(period, arbeidsgivere));

        expect(result.current).toEqual(false);
    });
    it('Kan ikke godkjenne periode dersom det finnes varsel som ikke er vurdert', () => {
        const period: BeregnetPeriodeFragment = getFetchedBeregnetPeriode(
            '2018-01-01',
            '2018-01-31',
            getVarsel(Varselstatus.Aktiv),
        );
        const arbeidsgivere: ArbeidsgiverFragment[] = [getArbeidsgiver('et orgnr', getGenerasjoner([period]))];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(period, arbeidsgivere));

        expect(result.current).toEqual(true);
    });
    it('Kan ikke godkjenne periode dersom det finnes varsel på tidligere periode som ikke er vurdert', () => {
        const period: BeregnetPeriodeFragment = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ArbeidsgiverFragment[] = [
            getArbeidsgiver(
                'et orgnr',
                getGenerasjoner([
                    period,
                    getFetchedBeregnetPeriode('2017-12-01', '2017-12-16', getVarsel(Varselstatus.Aktiv)),
                ]),
            ),
        ];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(period, arbeidsgivere));

        expect(result.current).toEqual(true);
    });
    it('Kan godkjenne periode dersom det kun finnes uvurderte varsler på perioder som ligger senere i tid', () => {
        const activePeriod: BeregnetPeriodeFragment = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ArbeidsgiverFragment[] = [
            getArbeidsgiver(
                'et orgnr',
                getGenerasjoner([
                    activePeriod,
                    getFetchedBeregnetPeriode('2018-02-01', '2018-02-28', getVarsel(Varselstatus.Aktiv)),
                ]),
            ),
        ];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere));

        expect(result.current).toEqual(false);
    });
    it('Kan ikke godkjenne periode dersom det finnes uvurderte varsler på perioder på andre arbeidsgivere som ligger før eller samtidig i tid', () => {
        const activePeriod: BeregnetPeriodeFragment = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ArbeidsgiverFragment[] = [
            getArbeidsgiver('et orgnr', getGenerasjoner([activePeriod])),
            getArbeidsgiver(
                'et annet orgnr',
                getGenerasjoner([getFetchedBeregnetPeriode('2018-01-01', '2018-01-31', getVarsel(Varselstatus.Aktiv))]),
            ),
        ];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere));

        expect(result.current).toEqual(true);
    });
    it('Kan ikke godkjenne periode dersom det finnes varsel på tidligere perioder på andre arbeidsgivere som som ikke er vurdert', () => {
        const activePeriod: BeregnetPeriodeFragment = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ArbeidsgiverFragment[] = [
            getArbeidsgiver('et orgnr', getGenerasjoner([activePeriod])),
            getArbeidsgiver(
                'et annet orgnr',
                getGenerasjoner([getFetchedBeregnetPeriode('2017-12-01', '2017-12-16', getVarsel(Varselstatus.Aktiv))]),
            ),
        ];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere));

        expect(result.current).toEqual(true);
    });
    it('Kan godkjenne periode dersom det finnes uvurderte varsler på perioder på andre arbeidsgivere som ligger senere i tid', () => {
        const activePeriod: BeregnetPeriodeFragment = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ArbeidsgiverFragment[] = [
            getArbeidsgiver('et orgnr', getGenerasjoner([activePeriod])),
            getArbeidsgiver(
                'et annet orgnr',
                getGenerasjoner([getFetchedBeregnetPeriode('2018-02-01', '2018-02-28', getVarsel(Varselstatus.Aktiv))]),
            ),
        ];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere));

        expect(result.current).toEqual(false);
    });
});
