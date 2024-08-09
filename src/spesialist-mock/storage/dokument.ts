import { DokumentInntektsmelding, Soknad, Soknadstype, Svartype } from '../schemaTypes';

export class DokumentMock {
    static getMockedSoknad = (): Soknad => {
        return {
            type: Soknadstype.Arbeidstaker,
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
                    __typename: 'Soknadsperioder',
                },
            ],
            sporsmal: [
                {
                    sporsmalstekst:
                        'Var du tilbake i fullt arbeid hos Pengeløs Sparebank i løpet av perioden 1. - 30. september 2023?',
                    svar: [
                        {
                            verdi: 'JA',
                            __typename: 'Svar',
                        },
                    ],
                    svartype: Svartype.JaNei,
                    tag: 'TILBAKE_I_ARBEID',
                    __typename: 'Sporsmal',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Når begynte du å jobbe igjen?',
                            svar: [
                                {
                                    verdi: '2023-09-29',
                                    __typename: 'Svar',
                                },
                            ],
                            svartype: Svartype.Dato,
                            __typename: 'Sporsmal',
                            undersporsmal: [],
                        },
                    ],
                },
                {
                    sporsmalstekst: 'Tok du ut feriedager i tidsrommet 1. - 28. september 2023?',
                    svar: [
                        {
                            verdi: 'JA',
                            __typename: 'Svar',
                        },
                    ],
                    svartype: Svartype.JaNei,
                    tag: 'FERIE_V2',
                    __typename: 'Sporsmal',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Når tok du ut feriedager?',
                            svar: [
                                {
                                    verdi: '{"fom":"2023-09-16","tom":"2023-09-17"}',
                                    __typename: 'Svar',
                                },
                            ],
                            svartype: Svartype.Perioder,
                            __typename: 'Sporsmal',
                            undersporsmal: [],
                        },
                    ],
                },
                {
                    sporsmalstekst: 'Tok du permisjon mens du var sykmeldt 1. - 28. september 2023?',
                    svar: [
                        {
                            verdi: 'JA',
                            __typename: 'Svar',
                        },
                    ],
                    svartype: Svartype.JaNei,
                    tag: 'PERMISJON_V2',
                    __typename: 'Sporsmal',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Når tok du permisjon?',
                            svar: [
                                {
                                    verdi: '{"fom":"2023-09-18","tom":"2023-09-19"}',
                                    __typename: 'Svar',
                                },
                            ],
                            svartype: Svartype.Perioder,
                            tag: 'PERMISJON_NAR_V2',
                            __typename: 'Sporsmal',
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
                            __typename: 'Svar',
                        },
                    ],
                    svartype: Svartype.JaNei,
                    tag: 'ARBEID_UNDERVEIS_100_PROSENT_0',
                    __typename: 'Sporsmal',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Oppgi arbeidsmengde i timer eller prosent:',
                            svar: [],
                            svartype: Svartype.RadioGruppeTimerProsent,
                            tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                            __typename: 'Sporsmal',
                            undersporsmal: [
                                {
                                    sporsmalstekst: 'Prosent',
                                    svar: [
                                        {
                                            verdi: 'CHECKED',
                                            __typename: 'Svar',
                                        },
                                    ],
                                    svartype: Svartype.Radio,
                                    tag: 'HVOR_MYE_PROSENT_0',
                                    __typename: 'Sporsmal',
                                    undersporsmal: [
                                        {
                                            sporsmalstekst:
                                                'Oppgi hvor mange prosent av din normale arbeidstid du jobbet hos Pengeløs Sparebank i perioden 1. - 28. september 2023?',
                                            svar: [
                                                {
                                                    verdi: '20',
                                                    __typename: 'Svar',
                                                },
                                            ],
                                            svartype: Svartype.Prosent,
                                            tag: 'HVOR_MYE_PROSENT_VERDI_0',
                                            __typename: 'Sporsmal',
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
                                    __typename: 'Svar',
                                },
                            ],
                            svartype: Svartype.JaNei,
                            tag: 'JOBBER_DU_NORMAL_ARBEIDSUKE_0',
                            __typename: 'Sporsmal',
                            undersporsmal: [
                                {
                                    sporsmalstekst: 'Oppgi timer per uke',
                                    svar: [
                                        {
                                            verdi: '40',
                                            __typename: 'Svar',
                                        },
                                    ],
                                    svartype: Svartype.Timer,
                                    tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                                    __typename: 'Sporsmal',
                                    undersporsmal: [],
                                },
                            ],
                        },
                    ],
                },
            ],
            __typename: 'Soknad',
        };
    };

    static getMockedInntektsmelding = (): DokumentInntektsmelding => {
        return {
            innsenderFulltNavn: 'MUSKULØS VALS',
            innsenderTelefon: '12345678',
            begrunnelseForReduksjonEllerIkkeUtbetalt: '',
            bruttoUtbetalt: null,
            beregnetInntekt: 35000.0,
            refusjon: {
                beloepPrMnd: 0.0,
                opphoersdato: null,
            },
            endringIRefusjoner: [],
            opphoerAvNaturalytelser: [],
            gjenopptakelseNaturalytelser: [],
            arbeidsgiverperioder: [
                {
                    fom: '2023-08-01',
                    tom: '2023-08-16',
                },
            ],
            ferieperioder: [],
            foersteFravaersdag: '2023-08-01',
            naerRelasjon: null,
            inntektEndringAarsak: {
                aarsak: 'Tariffendring',
                perioder: [
                    {
                        fom: '2023-08-01',
                        tom: '2023-08-16',
                    },
                    {
                        fom: '2023-08-01',
                        tom: '2023-08-16',
                    },
                ],
                gjelderFra: '2023-08-08',
                bleKjent: '2023-09-12',
            },
            avsenderSystem: {
                navn: 'SAP (SID:PO01/200)[BUILD: 20230616}',
            },
        };
    };
}
