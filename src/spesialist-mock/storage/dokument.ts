import { ApiDokumentInntektsmelding, ApiSoknad } from '@io/rest/generated/spesialist.schemas';

import { Soknadstype, Svartype } from '../schemaTypes';

export class DokumentMock {
    static getMockedSoknad = (): ApiSoknad => {
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
                },
            ],
            sporsmal: [
                {
                    sporsmalstekst:
                        'Var du tilbake i fullt arbeid hos Pengeløs Sparebank i løpet av perioden 1. - 30. september 2023?',
                    svar: [
                        {
                            verdi: 'JA',
                        },
                    ],
                    svartype: Svartype.JaNei,
                    tag: 'TILBAKE_I_ARBEID',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Når begynte du å jobbe igjen?',
                            svar: [
                                {
                                    verdi: '2023-09-29',
                                },
                            ],
                            svartype: Svartype.Dato,
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
                    svartype: Svartype.JaNei,
                    tag: 'FERIE_V2',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Når tok du ut feriedager?',
                            svar: [
                                {
                                    verdi: '{"fom":"2023-09-16","tom":"2023-09-17"}',
                                },
                            ],
                            svartype: Svartype.Perioder,
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
                    svartype: Svartype.JaNei,
                    tag: 'PERMISJON_V2',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Når tok du permisjon?',
                            svar: [
                                {
                                    verdi: '{"fom":"2023-09-18","tom":"2023-09-19"}',
                                },
                            ],
                            svartype: Svartype.Perioder,
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
                    svartype: Svartype.JaNei,
                    tag: 'ARBEID_UNDERVEIS_100_PROSENT_0',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Oppgi arbeidsmengde i timer eller prosent:',
                            svar: [],
                            svartype: Svartype.RadioGruppeTimerProsent,
                            tag: 'HVOR_MYE_HAR_DU_JOBBET_0',
                            undersporsmal: [
                                {
                                    sporsmalstekst: 'Prosent',
                                    svar: [
                                        {
                                            verdi: 'CHECKED',
                                        },
                                    ],
                                    svartype: Svartype.Radio,
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
                                            svartype: Svartype.Prosent,
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
                            svartype: Svartype.JaNei,
                            tag: 'JOBBER_DU_NORMAL_ARBEIDSUKE_0',
                            undersporsmal: [
                                {
                                    sporsmalstekst: 'Oppgi timer per uke',
                                    svar: [
                                        {
                                            verdi: '40',
                                        },
                                    ],
                                    svartype: Svartype.Timer,
                                    tag: 'HVOR_MANGE_TIMER_PER_UKE_0',
                                    undersporsmal: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    };

    static getMockedInntektsmelding = (): ApiDokumentInntektsmelding => {
        return {
            arbeidsforholdId: '123431242',
            virksomhetsnummer: '967170232',
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
                    tom: '2023-08-13',
                },
                {
                    fom: '2023-08-14',
                    tom: '2023-08-16',
                },
            ],
            ferieperioder: [],
            foersteFravaersdag: '2023-08-01',
            naerRelasjon: null,
            inntektEndringAarsaker: [
                {
                    aarsak: 'NyStillingsprosent',
                    perioder: null,
                    gjelderFra: '2025-01-01',
                    bleKjent: null,
                },
                {
                    aarsak: 'Permisjon',
                    perioder: [
                        {
                            fom: '2025-01-01',
                            tom: '2025-01-02',
                        },
                    ],
                    gjelderFra: null,
                    bleKjent: null,
                },
            ],
            avsenderSystem: {
                navn: 'SAP (SID:PO01/200)[BUILD: 20230616}',
            },
        };
    };
}
