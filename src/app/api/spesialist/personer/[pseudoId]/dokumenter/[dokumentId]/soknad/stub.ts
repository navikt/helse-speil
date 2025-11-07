import { ApiSoknad, ApiSoknadstype, ApiSvartype } from '@io/rest/generated/spesialist.schemas';

export const stub = async () => {
    if (Math.random() > 0.9) return Response.error();
    else return Response.json(mockedSøknad);
};

const mockedSøknad: ApiSoknad = {
    type: ApiSoknadstype.Arbeidstaker,
    arbeidGjenopptatt: '2023-09-29',
    sykmeldingSkrevet: '2023-09-01T02:00:00',
    egenmeldingsdagerFraSykmelding: ['2023-09-22', '2023-09-21', '2023-09-24', '2023-09-20'],
    soknadsperioder: [
        {
            fom: '2023-09-01',
            tom: '2023-09-30',
            grad: null,
            faktiskGrad: 20,
            sykmeldingsgrad: 100,
        },
    ],
    selvstendigNaringsdrivende: {
        inntekt: [
            {
                ar: '2018',
                pensjonsgivendeInntektAvNaringsinntektFraFiskeFangstEllerFamiliebarnehage: 0,
                pensjonsgivendeInntektAvLonnsinntekt: 0,
                pensjonsgivendeInntektAvNaringsinntekt: 50_000,
                pensjonsgivendeInntektAvLonnsinntektBarePensjonsdel: 0,
                erFerdigLignet: true,
            },
            {
                ar: '2019',
                pensjonsgivendeInntektAvNaringsinntektFraFiskeFangstEllerFamiliebarnehage: 0,
                pensjonsgivendeInntektAvLonnsinntekt: 0,
                pensjonsgivendeInntektAvNaringsinntekt: 60_000,
                pensjonsgivendeInntektAvLonnsinntektBarePensjonsdel: 0,
                erFerdigLignet: true,
            },
            {
                ar: '2020',
                pensjonsgivendeInntektAvNaringsinntektFraFiskeFangstEllerFamiliebarnehage: 10,
                pensjonsgivendeInntektAvLonnsinntekt: 0,
                pensjonsgivendeInntektAvNaringsinntekt: 100_000,
                pensjonsgivendeInntektAvLonnsinntektBarePensjonsdel: 0,
                erFerdigLignet: true,
            },
        ],
    },
    sporsmal: [
        {
            sporsmalstekst:
                'Var du tilbake i fullt arbeid hos Pengeløs Sparebank i løpet av perioden 1. - 30. september 2023?',
            svar: [
                {
                    verdi: 'JA',
                },
            ],
            svartype: ApiSvartype.JA_NEI,
            tag: 'TILBAKE_I_ARBEID',
            undersporsmal: [
                {
                    sporsmalstekst: 'Når begynte du å jobbe igjen?',
                    svar: [
                        {
                            verdi: '2023-09-29',
                        },
                    ],
                    svartype: ApiSvartype.DATO,
                    undersporsmal: [],
                },
            ],
        },
        {
            sporsmalstekst: 'Tok du ut feriedager i tidsrommet 1. - 28. september 2023?',
            svar: [
                {
                    verdi: 'JA',
                },
            ],
            svartype: ApiSvartype.JA_NEI,
            tag: 'FERIE_V2',
            undersporsmal: [
                {
                    sporsmalstekst: 'Når tok du ut feriedager?',
                    svar: [
                        {
                            verdi: '{"fom":"2023-09-16","tom":"2023-09-17"}',
                        },
                    ],
                    svartype: ApiSvartype.PERIODER,
                    undersporsmal: [],
                },
            ],
        },
        {
            sporsmalstekst: 'Tok du permisjon mens du var sykmeldt 1. - 28. september 2023?',
            svar: [
                {
                    verdi: 'JA',
                },
            ],
            svartype: ApiSvartype.JA_NEI,
            tag: 'PERMISJON_V2',
            undersporsmal: [
                {
                    sporsmalstekst: 'Når tok du permisjon?',
                    svar: [
                        {
                            verdi: '{"fom":"2023-09-18","tom":"2023-09-19"}',
                        },
                    ],
                    svartype: ApiSvartype.PERIODER,
                    tag: 'PERMISJON_NAR_V2',
                    undersporsmal: [],
                },
            ],
        },
        {
            sporsmalstekst:
                'I perioden 1. - 28. september 2023 var du 100 % sykmeldt fra Pengeløs Sparebank. Jobbet du noe hos Pengeløs Sparebank i denne perioden?',
            svar: [
                {
                    verdi: 'JA',
                },
            ],
            svartype: ApiSvartype.JA_NEI,
            tag: 'ARBEID_UNDERVEIS_100_PROSENT_0',
            undersporsmal: [
                {
                    sporsmalstekst: 'Oppgi arbeidsmengde i timer eller prosent:',
                    svar: [],
                    svartype: ApiSvartype.RADIO_GRUPPE_TIMER_PROSENT,
                    tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Prosent',
                            svar: [
                                {
                                    verdi: 'CHECKED',
                                },
                            ],
                            svartype: ApiSvartype.RADIO,
                            tag: 'HVOR_MYE_PROSENT_0',
                            undersporsmal: [
                                {
                                    sporsmalstekst:
                                        'Oppgi hvor mange prosent av din normale arbeidstid du jobbet hos Pengeløs Sparebank i perioden 1. - 28. september 2023?',
                                    svar: [
                                        {
                                            verdi: '20',
                                        },
                                    ],
                                    svartype: ApiSvartype.PROSENT,
                                    tag: 'HVOR_MYE_PROSENT_VERDI_0',
                                    undersporsmal: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    sporsmalstekst: 'Jobber du vanligvis 37,5 timer i uka hos Pengeløs Sparebank?',
                    svar: [
                        {
                            verdi: 'NEI',
                        },
                    ],
                    svartype: ApiSvartype.JA_NEI,
                    tag: 'JOBBER_DU_NORMAL_ARBEIDSUKE_0',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Oppgi timer per uke',
                            svar: [
                                {
                                    verdi: '40',
                                },
                            ],
                            svartype: ApiSvartype.TIMER,
                            tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                            undersporsmal: [],
                        },
                    ],
                },
            ],
        },
    ],
};
