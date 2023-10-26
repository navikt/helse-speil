import { Soknad, Svartype } from '../schemaTypes';

export class DokumentMock {
    static getMockedSoknad = (): Soknad => {
        return {
            arbeidGjenopptatt: '2023-09-29',
            sykmeldingSkrevet: '2023-09-01T02:00:00',
            egenmeldingsdagerFraSykmelding: ['2023-09-22', '2023-09-23', '2023-09-24', '2023-09-28'],
            soknadsperioder: [
                {
                    fom: '2023-09-01',
                    tom: '2023-09-30',
                    grad: 100,
                    faktiskGrad: 20,
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
                    __typename: 'Sporsmal',
                    undersporsmal: [
                        {
                            sporsmalstekst: 'Oppgi arbeidsmengde i timer eller prosent:',
                            svar: [],
                            svartype: Svartype.RadioGruppeTimerProsent,
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
}
