import { harUvurderteVarslerPåEllerFør } from '@hooks/uvurderteVarsler';
import {
    ApiArbeidsgiver,
    ApiBeregnetPeriode,
    ApiInntektstype,
    ApiKilde,
    ApiPeriodetilstand,
    ApiPeriodetype,
    ApiPeriodevilkar,
    ApiSaksbildeVarselstatus,
    ApiSykdomsdagtype,
    ApiUtbetalingsdagtype,
    ApiUtbetalingstatus,
    ApiUtbetalingtype,
    ApiVarselDTO,
} from '@io/rest/generated/spesialist.schemas';

const getFetchedBeregnetPeriode = (fom: string, tom: string, varsel?: ApiVarselDTO): ApiBeregnetPeriode => {
    return {
        type: 'ApiBeregnetPeriode',
        behandlingId: 'EN_BEHANDLING_ID',
        erForkastet: false,
        fom: fom,
        tom: tom,
        hendelser: [],
        id: 'EN_ID',
        inntektstype: ApiInntektstype.ENARBEIDSGIVER,
        maksdato: '2023-01-01',
        opprettet: '2020-01-01',
        historikkinnslag: [],
        periodetilstand: ApiPeriodetilstand.TilGodkjenning,
        periodetype: ApiPeriodetype.FORSTEGANGSBEHANDLING,
        periodevilkar: {} as ApiPeriodevilkar,
        skjaeringstidspunkt: 'ET_SKJAERINGSTIDSPUNKT',
        tidslinje: [
            {
                dato: '2022-01-01',
                utbetalingsinfo: null,
                begrunnelser: null,
                grad: null,
                kilde: {} as ApiKilde,
                sykdomsdagtype: ApiSykdomsdagtype.ARBEIDSGIVERDAG,
                utbetalingsdagtype: ApiUtbetalingsdagtype.ARBEIDSGIVERPERIODEDAG,
            },
        ],
        utbetaling: {
            arbeidsgiverFagsystemId: 'EN_ID',
            arbeidsgiverNettoBelop: 0,
            id: 'EN_ID',
            personFagsystemId: 'EN_ID',
            personNettoBelop: 0,
            status: ApiUtbetalingstatus.UBETALT,
            type: ApiUtbetalingtype.UTBETALING,
            arbeidsgiversimulering: null,
            personsimulering: null,
            vurdering: null,
        },
        varsler: varsel ? [varsel] : [],
        vedtaksperiodeId: 'EN_ID',
        egenskaper: [],
        avslag: [],
        vedtakBegrunnelser: [],
        annullering: null,
        risikovurdering: null,
        forbrukteSykedager: null,
        gjenstaendeSykedager: null,
        paVent: null,
        vilkarsgrunnlagId: null,
        pensjonsgivendeInntekter: [],
        annulleringskandidater: [],
        grunnbelopsjustertGjennomsnitt: null,
    };
};

const getVarsel = (status?: ApiSaksbildeVarselstatus): ApiVarselDTO => {
    return {
        id: 'd58b0cbe-8fe6-495b-b312-4e8a8f4db3dd',
        definisjonId: 'en verdi',
        behandlingId: 'en verdi',
        opprettet: '2020-01-01',
        kode: 'RV_IM_1',
        tittel: '',
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

const getArbeidsgiver = (
    organisasjonsnummer: string,
    behandlinger: ApiArbeidsgiver['behandlinger'],
): ApiArbeidsgiver => {
    return {
        arbeidsforhold: [],
        behandlinger: behandlinger,
        ghostPerioder: [],
        navn: 'EN_ARBEIDSGIVER',
        organisasjonsnummer: organisasjonsnummer,
        overstyringer: [],
        inntekterFraAordningen: [],
    };
};

const getBehandlinger = (periods: ApiBeregnetPeriode[]) => {
    return [
        {
            id: 'EN_ID',
            perioder: periods,
        },
    ];
};

describe('harUvurderteVarslerPåEllerFør', () => {
    it('Arbeidsgiver uten behandlinger filtreres vekk før sjekk av uvurderte varsler', () => {
        const period: ApiBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ApiArbeidsgiver[] = [
            getArbeidsgiver('et orgnr1', []),
            getArbeidsgiver(
                'et annet orgnr',
                getBehandlinger([
                    getFetchedBeregnetPeriode('2017-12-01', '2017-12-31'),
                    getFetchedBeregnetPeriode('2018-01-01', '2018-01-31'),
                    getFetchedBeregnetPeriode('2018-02-01', '2018-02-28'),
                ]),
            ),
        ];

        const result = harUvurderteVarslerPåEllerFør(period, arbeidsgivere);

        expect(result).toEqual(false);
    });
    it('Kan godkjenne varsler dersom det ikke finnes uvurderte varsler', () => {
        const period: ApiBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ApiArbeidsgiver[] = [
            getArbeidsgiver('et orgnr', getBehandlinger([period])),
            getArbeidsgiver(
                'et annet orgnr',
                getBehandlinger([
                    getFetchedBeregnetPeriode('2017-12-01', '2017-12-31'),
                    getFetchedBeregnetPeriode('2018-01-01', '2018-01-31'),
                    getFetchedBeregnetPeriode('2018-02-01', '2018-02-28'),
                ]),
            ),
        ];

        const result = harUvurderteVarslerPåEllerFør(period, arbeidsgivere);

        expect(result).toEqual(false);
    });
    it('Kan ikke godkjenne periode dersom det finnes varsel som ikke er vurdert', () => {
        const period: ApiBeregnetPeriode = getFetchedBeregnetPeriode(
            '2018-01-01',
            '2018-01-31',
            getVarsel(ApiSaksbildeVarselstatus.AKTIV),
        );
        const arbeidsgivere: ApiArbeidsgiver[] = [getArbeidsgiver('et orgnr', getBehandlinger([period]))];

        const result = harUvurderteVarslerPåEllerFør(period, arbeidsgivere);

        expect(result).toEqual(true);
    });
    it('Kan ikke godkjenne periode dersom det finnes varsel på tidligere periode som ikke er vurdert', () => {
        const period: ApiBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ApiArbeidsgiver[] = [
            getArbeidsgiver(
                'et orgnr',
                getBehandlinger([
                    period,
                    getFetchedBeregnetPeriode('2017-12-01', '2017-12-16', getVarsel(ApiSaksbildeVarselstatus.AKTIV)),
                ]),
            ),
        ];

        const result = harUvurderteVarslerPåEllerFør(period, arbeidsgivere);

        expect(result).toEqual(true);
    });
    it('Kan godkjenne periode dersom det kun finnes uvurderte varsler på perioder som ligger senere i tid', () => {
        const activePeriod: ApiBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ApiArbeidsgiver[] = [
            getArbeidsgiver(
                'et orgnr',
                getBehandlinger([
                    activePeriod,
                    getFetchedBeregnetPeriode('2018-02-01', '2018-02-28', getVarsel(ApiSaksbildeVarselstatus.AKTIV)),
                ]),
            ),
        ];

        const result = harUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere);

        expect(result).toEqual(false);
    });
    it('Kan ikke godkjenne periode dersom det finnes uvurderte varsler på perioder på andre arbeidsgivere som ligger før eller samtidig i tid', () => {
        const activePeriod: ApiBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ApiArbeidsgiver[] = [
            getArbeidsgiver('et orgnr', getBehandlinger([activePeriod])),
            getArbeidsgiver(
                'et annet orgnr',
                getBehandlinger([
                    getFetchedBeregnetPeriode('2018-01-01', '2018-01-31', getVarsel(ApiSaksbildeVarselstatus.AKTIV)),
                ]),
            ),
        ];

        const result = harUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere);

        expect(result).toEqual(true);
    });
    it('Kan ikke godkjenne periode dersom det finnes varsel på tidligere perioder på andre arbeidsgivere som som ikke er vurdert', () => {
        const activePeriod: ApiBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ApiArbeidsgiver[] = [
            getArbeidsgiver('et orgnr', getBehandlinger([activePeriod])),
            getArbeidsgiver(
                'et annet orgnr',
                getBehandlinger([
                    getFetchedBeregnetPeriode('2017-12-01', '2017-12-16', getVarsel(ApiSaksbildeVarselstatus.AKTIV)),
                ]),
            ),
        ];

        const result = harUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere);

        expect(result).toEqual(true);
    });
    it('Kan godkjenne periode dersom det finnes uvurderte varsler på perioder på andre arbeidsgivere som ligger senere i tid', () => {
        const activePeriod: ApiBeregnetPeriode = getFetchedBeregnetPeriode('2018-01-01', '2018-01-31');
        const arbeidsgivere: ApiArbeidsgiver[] = [
            getArbeidsgiver('et orgnr', getBehandlinger([activePeriod])),
            getArbeidsgiver(
                'et annet orgnr',
                getBehandlinger([
                    getFetchedBeregnetPeriode('2018-02-01', '2018-02-28', getVarsel(ApiSaksbildeVarselstatus.AKTIV)),
                ]),
            ),
        ];

        const result = harUvurderteVarslerPåEllerFør(activePeriod, arbeidsgivere);

        expect(result).toEqual(false);
    });
});
