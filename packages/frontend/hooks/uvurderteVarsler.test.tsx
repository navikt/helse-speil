import { useHarUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import {
    Arbeidsgiver,
    Generasjon,
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
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';

const getFetchedBeregnetPeriode = (fom: string, tom: string, varsel?: VarselDto): FetchedBeregnetPeriode => {
    return {
        aktivitetslogg: [],
        beregningId: 'EN_ID',
        erForkastet: false,
        fom: fom,
        tom: tom,
        handlinger: [],
        hendelser: [],
        id: 'EN_ID',
        inntektFraAordningen: [],
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
                dato: '2022-01-01',
                kilde: {} as Kilde,
                sykdomsdagtype: Sykdomsdagtype.Arbeidsgiverdag,
                utbetalingsdagtype: Utbetalingsdagtype.Arbeidsgiverperiodedag,
            },
        ],
        utbetaling: {
            arbeidsgiverFagsystemId: 'EN_ID',
            arbeidsgiverNettoBelop: 0,
            id: 'EN_ID',
            personFagsystemId: 'EN_ID',
            personNettoBelop: 0,
            status: Utbetalingstatus.Ubetalt,
            type: Utbetalingtype.Utbetaling,
        },
        varsler: varsel ? [varsel] : [],
        vedtaksperiodeId: 'EN_ID',
    };
};

const getVarsel = (status?: Varselstatus): VarselDto => {
    return {
        definisjonId: 'en verdi',
        generasjonId: 'en verdi',
        kode: 'RV_IM_1',
        tittel: '',
        vurdering: status
            ? {
                  ident: 'en ident',
                  status: status,
                  tidsstempel: 'et tidsstempel',
              }
            : undefined,
    };
};

const getArbeidsgiver = (organisasjonsnummer: string, generasjoner: Generasjon[]): Arbeidsgiver => {
    return {
        arbeidsforhold: [],
        bransjer: [],
        generasjoner: generasjoner,
        ghostPerioder: [],
        navn: 'EN_ARBEIDSGIVER',
        organisasjonsnummer: organisasjonsnummer,
        overstyringer: [],
    };
};

const getGenerasjoner = (periods: FetchedBeregnetPeriode[]) => {
    return [
        {
            id: 'EN_ID',
            perioder: periods,
        },
    ];
};

describe('useUvurderteVarslerpåEllerFør', () => {
    it('Arbeidsgiver uten generasjoner filtreres vekk før sjekk av uvurderte varsler', () => {
        const period: FetchedBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: Arbeidsgiver[] = [
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
        const period: FetchedBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: Arbeidsgiver[] = [
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
        const period: FetchedBeregnetPeriode = getFetchedBeregnetPeriode(
            '2018-01-01',
            '2018-01-31',
            getVarsel(Varselstatus.Aktiv),
        );
        const arbeidsgivere: Arbeidsgiver[] = [getArbeidsgiver('et orgnr', getGenerasjoner([period]))];

        const { result } = renderHook(() => useHarUvurderteVarslerPåEllerFør(period, arbeidsgivere));

        expect(result.current).toEqual(true);
    });
    it('Kan ikke godkjenne periode dersom det finnes varsel på tidligere periode som ikke er vurdert', () => {
        const period: FetchedBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: Arbeidsgiver[] = [
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
        const activePeriod: FetchedBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: Arbeidsgiver[] = [
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
        const activePeriod: FetchedBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: Arbeidsgiver[] = [
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
        const activePeriod: FetchedBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: Arbeidsgiver[] = [
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
        const activePeriod: FetchedBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: Arbeidsgiver[] = [
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
