// @ts-nocheck
import { mapPerson } from './personmapper';
import { Inntektsmelding } from '../types';

test('mapper person', () => {
    let person = mapPerson(enPerson, personInfo);
    expect(person).toEqual(mappetPerson);
});

const enPerson = {
    aktørId: '1211109876233',
    fødselsnummer: '01019000123',
    arbeidsgivere: [
        {
            organisasjonsnummer: '123456789',
            id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
            utbetalingsreferanse: 1581678015629,
            vedtaksperioder: [
                {
                    id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
                    maksdato: '2020-09-07',
                    godkjentAv: null,
                    utbetalingsreferanse: null,
                    førsteFraværsdag: '2019-09-10',
                    inntektFraInntektsmelding: 31000.0,
                    dataForVilkårsvurdering: {
                        erEgenAnsatt: false,
                        beregnetÅrsinntektFraInntektskomponenten: 372000.0,
                        avviksprosent: 0.0,
                        antallOpptjeningsdagerErMinst: 3539,
                        harOpptjening: true
                    },
                    tilstand: 'AVVENTER_GODKJENNING',
                    sykdomstidslinje: [
                        {
                            dagen: '2019-09-10',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-11',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-12',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-13',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-14',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-15',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-16',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-17',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-18',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-19',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-20',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-21',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-22',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-23',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-24',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-25',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-26',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-27',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-28',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-29',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-30',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-10-01',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-02',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-03',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-04',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-05',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        }
                    ],
                    utbetalingslinjer: [
                        {
                            fom: '2019-09-26',
                            tom: '2019-09-30',
                            dagsats: 1431
                        }
                    ],
                    utbetalingstidslinje: [
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-10'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-11'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-12'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-13'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-14'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-15'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-16'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-17'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-18'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-19'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-20'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-21'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-22'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-23'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-24'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-25'
                        },
                        {
                            type: 'NavDag',
                            inntekt: 1430.77,
                            dato: '2019-09-26',
                            utbetaling: 1431
                        },
                        {
                            type: 'NavDag',
                            inntekt: 1430.77,
                            dato: '2019-09-27',
                            utbetaling: 1431
                        },
                        {
                            type: 'NavHelgDag',
                            inntekt: 0.0,
                            dato: '2019-09-28'
                        },
                        {
                            type: 'NavHelgDag',
                            inntekt: 0.0,
                            dato: '2019-09-29'
                        },
                        {
                            type: 'NavDag',
                            inntekt: 1430.77,
                            dato: '2019-09-30',
                            utbetaling: 1431
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-01'
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-02'
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-03'
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-04'
                        },
                        {
                            type: 'NavHelgDag',
                            inntekt: 0.0,
                            dato: '2019-10-05'
                        }
                    ]
                }
            ]
        }
    ],
    hendelser: [
        {
            rapportertdato: '2020-02-14T12:00:15.515707',
            fom: '2019-09-16',
            tom: '2019-10-05',
            type: 'NY_SØKNAD'
        },
        {
            rapportertdato: '2020-02-14T12:00:15.730199',
            sendtNav: '2019-10-15T00:00:00',
            fom: '2019-09-16',
            tom: '2019-10-05',
            type: 'SENDT_SØKNAD'
        },
        {
            beregnetInntekt: 31000.0,
            førsteFraværsdag: '2019-09-10',
            type: 'INNTEKTSMELDING'
        }
    ]
};

// test('filtrerer vekk paddede arbeidsdager', () => {
//     const paddedeArbeidsdager = [
//         {
//             dato: '2019-09-08',
//             type: 'ARBEIDSDAG',
//             erstatter: [],
//             hendelseId: 'f8d10337-b0de-4036-ba95-67e5d0f041e4'
//         },
//         {
//             dato: '2019-09-09',
//             type: 'ARBEIDSDAG',
//             erstatter: [],
//             hendelseId: 'f8d10337-b0de-4036-ba95-67e5d0f041e4'
//         }
//     ];
//
//     const personMedPaddedeArbeidsdager: UnmappedPerson = {
//         ...enPerson,
//         arbeidsgivere: [
//             {
//                 ...enPerson.arbeidsgivere[0],
//                 vedtaksperioder: [
//                     {
//                         ...enPerson.arbeidsgivere[0].vedtaksperioder[0],
//                         sykdomstidslinje: [
//                             ...paddedeArbeidsdager,
//                             ...enPerson.arbeidsgivere[0].vedtaksperioder[0].sykdomstidslinje
//                         ]
//                     }
//                 ]
//             }
//         ]
//     };
//
//     const p = mapPerson(personMedPaddedeArbeidsdager, per)
//
//     expect(enesteVedtaksperiode(personMedPaddedeArbeidsdager).sykdomstidslinje).toEqual(
//         expect.objectContaining(paddedeArbeidsdager)
//     )});

//     const sakUtenPaddedeArbeidsdager: Vedtaksperiode = filtrerPaddedeArbeidsdager(
//         enesteVedtaksperiode(personMedPaddedeArbeidsdager)
//     );
//
//     const førsteDag = sakUtenPaddedeArbeidsdager.sykdomstidslinje[0];
//     expect(førsteDag.type !== Dagtype.ARBEIDSDAG).toBeTruthy();
// });
//
// test('Opptjening er undefined dersom felter er satt til null', () => {
//     const personUtenOpptjeningsinfo: UnmappedPerson = {
//         ...behov,
//         arbeidsgivere: [
//             {
//                 ...behov.arbeidsgivere[0],
//                 vedtaksperioder: [
//                     {
//                         ...behov.arbeidsgivere[0].vedtaksperioder[0],
//                         dataForVilkårsvurdering: {
//                             ...behov.arbeidsgivere[0].vedtaksperioder[0].dataForVilkårsvurdering,
//                             antallOpptjeningsdagerErMinst: null,
//                             harOpptjening: null
//                         }
//                     }
//                 ]
//             }
//         ]
//     };
//
//     const personinfo = {
//         fødselsdato: '1956-12-12',
//         fnr: '123',
//         kjønn: 'mann',
//         navn: 'Sjaman Durek'
//     };
//     expect(
//         personMapper.map(personUtenOpptjeningsinfo, personinfo).inngangsvilkår.opptjening
//     ).toBeUndefined();
//     expect(personMapper.map(behov, personinfo).inngangsvilkår.opptjening).toBeDefined();
// });
//
// test('fjerner ingen dager dersom første dag ikke er ARBEIDSDAG eller IMPLISITT_DAG', () => {
//     const unmappedPerson: UnmappedPerson = { ...behov };
//     const opprinneligSak: Vedtaksperiode = enesteVedtaksperiode(unmappedPerson);
//     const sakUtenPaddedeArbeidsdager: Vedtaksperiode = filtrerPaddedeArbeidsdager(
//         enesteVedtaksperiode(unmappedPerson)
//     );
//
//     opprinneligSak.sykdomstidslinje.forEach((dag, i) => {
//         const ikkePaddetDag = sakUtenPaddedeArbeidsdager.sykdomstidslinje[i];
//         expect(ikkePaddetDag.type).toBe(dag.type);
//     });
// });
//
// test('beregner alder riktig', () => {
//     const søknadstidspunkt1 = '2020-01-14T00:00:00';
//     const søknadstidspunkt2 = '2020-01-15T00:00:00';
//     const fødselsdato = '2000-01-15';
//
//     expect(beregnAlder(søknadstidspunkt1, fødselsdato)).toBe(19);
//     expect(beregnAlder(søknadstidspunkt2, fødselsdato)).toBe(20);
// });

const personInfo = {
    navn: 'Ole Brum',
    kjønn: 'Mannebjørn',
    fødselsdato: '1956-12-12',
    fnr: '01019000123'
};

const mappetPerson = {
    aktørId: '1211109876233',
    arbeidsgivere: [
        {
            id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
            organisasjonsnummer: '123456789',
            vedtaksperioder: [
                {
                    id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
                    fom: '2019-09-10',
                    tom: '2019-10-05',
                    tilstand: 'AVVENTER_GODKJENNING',
                    inngangsvilkår: {
                        dagerIgjen: {
                            dagerBrukt: 3,
                            førsteFraværsdag: '2019-09-10',
                            førsteSykepengedag: '2019-09-26',
                            maksdato: '2020-09-07',
                            tidligerePerioder: []
                        },
                        søknadsfrist: {
                            innen3Mnd: true,
                            søknadTom: '2019-10-05',
                            sendtNav: '2019-10-15T00:00:00'
                        },
                        opptjening: {
                            antallOpptjeningsdagerErMinst: 3539,
                            opptjeningFra: '01.01.2010',
                            harOpptjening: true
                        },
                        alderISykmeldingsperioden: 62
                    },
                    utbetalingstidslinje: [
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-10'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-11'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-12'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-13'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-14'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-15'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-16'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-17'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-18'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-19'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-20'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-21'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-22'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-23'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-24'
                        },
                        {
                            type: 'ArbeidsgiverperiodeDag',
                            inntekt: 1430.77,
                            dato: '2019-09-25'
                        },
                        {
                            type: 'NavDag',
                            inntekt: 1430.77,
                            dato: '2019-09-26',
                            utbetaling: 1431
                        },
                        {
                            type: 'NavDag',
                            inntekt: 1430.77,
                            dato: '2019-09-27',
                            utbetaling: 1431
                        },
                        {
                            type: 'NavHelgDag',
                            inntekt: 0.0,
                            dato: '2019-09-28'
                        },
                        {
                            type: 'NavHelgDag',
                            inntekt: 0.0,
                            dato: '2019-09-29'
                        },
                        {
                            type: 'NavDag',
                            inntekt: 1430.77,
                            dato: '2019-09-30',
                            utbetaling: 1431
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-01'
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-02'
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-03'
                        },
                        {
                            type: 'Fridag',
                            inntekt: 1430.77,
                            dato: '2019-10-04'
                        },
                        {
                            type: 'NavHelgDag',
                            inntekt: 0.0,
                            dato: '2019-10-05'
                        }
                    ],
                    sykdomstidslinje: [
                        {
                            dagen: '2019-09-10',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-11',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-12',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-13',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-14',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-15',
                            hendelseType: 'Inntektsmelding',
                            type: 'EGENMELDINGSDAG'
                        },
                        {
                            dagen: '2019-09-16',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-17',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-18',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-19',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-20',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-21',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-22',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-23',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-24',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-25',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-26',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-27',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-09-28',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-29',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        },
                        {
                            dagen: '2019-09-30',
                            hendelseType: 'Sykmelding',
                            type: 'SYKEDAG'
                        },
                        {
                            dagen: '2019-10-01',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-02',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-03',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-04',
                            hendelseType: 'Søknad',
                            type: 'FERIEDAG'
                        },
                        {
                            dagen: '2019-10-05',
                            hendelseType: 'Søknad',
                            type: 'SYK_HELGEDAG'
                        }
                    ],
                    sykepengegrunnlag: {
                        årsinntektFraAording: 372000.0,
                        årsinntektFraInntektsmelding: 372000.0,
                        avviksprosent: 0.0,
                        dagsats: 1431
                    },
                    inntektskilder: {
                        månedsinntekt: 31000,
                        årsinntekt: 372000.0,
                        refusjon: 'Ja',
                        forskuttering: 'Ja'
                    },
                    oppsummering: {
                        antallUtbetalingsdager: 3,
                        totaltTilUtbetaling: 4293
                    },
                    utbetalingsreferanse: null,
                    rawData: {
                        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
                        maksdato: '2020-09-07',
                        godkjentAv: null,
                        utbetalingsreferanse: null,
                        førsteFraværsdag: '2019-09-10',
                        inntektFraInntektsmelding: 31000.0,
                        dataForVilkårsvurdering: {
                            erEgenAnsatt: false,
                            beregnetÅrsinntektFraInntektskomponenten: 372000.0,
                            avviksprosent: 0.0,
                            antallOpptjeningsdagerErMinst: 3539,
                            harOpptjening: true
                        },
                        tilstand: 'AVVENTER_GODKJENNING',
                        sykdomstidslinje: [
                            {
                                dagen: '2019-09-10',
                                hendelseType: 'Inntektsmelding',
                                type: 'EGENMELDINGSDAG'
                            },
                            {
                                dagen: '2019-09-11',
                                hendelseType: 'Inntektsmelding',
                                type: 'EGENMELDINGSDAG'
                            },
                            {
                                dagen: '2019-09-12',
                                hendelseType: 'Inntektsmelding',
                                type: 'EGENMELDINGSDAG'
                            },
                            {
                                dagen: '2019-09-13',
                                hendelseType: 'Inntektsmelding',
                                type: 'EGENMELDINGSDAG'
                            },
                            {
                                dagen: '2019-09-14',
                                hendelseType: 'Inntektsmelding',
                                type: 'EGENMELDINGSDAG'
                            },
                            {
                                dagen: '2019-09-15',
                                hendelseType: 'Inntektsmelding',
                                type: 'EGENMELDINGSDAG'
                            },
                            {
                                dagen: '2019-09-16',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-17',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-18',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-19',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-20',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-21',
                                hendelseType: 'Søknad',
                                type: 'SYK_HELGEDAG'
                            },
                            {
                                dagen: '2019-09-22',
                                hendelseType: 'Søknad',
                                type: 'SYK_HELGEDAG'
                            },
                            {
                                dagen: '2019-09-23',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-24',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-25',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-26',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-27',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-09-28',
                                hendelseType: 'Søknad',
                                type: 'SYK_HELGEDAG'
                            },
                            {
                                dagen: '2019-09-29',
                                hendelseType: 'Søknad',
                                type: 'SYK_HELGEDAG'
                            },
                            {
                                dagen: '2019-09-30',
                                hendelseType: 'Sykmelding',
                                type: 'SYKEDAG'
                            },
                            {
                                dagen: '2019-10-01',
                                hendelseType: 'Søknad',
                                type: 'FERIEDAG'
                            },
                            {
                                dagen: '2019-10-02',
                                hendelseType: 'Søknad',
                                type: 'FERIEDAG'
                            },
                            {
                                dagen: '2019-10-03',
                                hendelseType: 'Søknad',
                                type: 'FERIEDAG'
                            },
                            {
                                dagen: '2019-10-04',
                                hendelseType: 'Søknad',
                                type: 'FERIEDAG'
                            },
                            {
                                dagen: '2019-10-05',
                                hendelseType: 'Søknad',
                                type: 'SYK_HELGEDAG'
                            }
                        ],
                        utbetalingslinjer: [
                            {
                                fom: '2019-09-26',
                                tom: '2019-09-30',
                                dagsats: 1431
                            }
                        ],
                        utbetalingstidslinje: [
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-10'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-11'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-12'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-13'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-14'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-15'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-16'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-17'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-18'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-19'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-20'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-21'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-22'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-23'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-24'
                            },
                            {
                                type: 'ArbeidsgiverperiodeDag',
                                inntekt: 1430.77,
                                dato: '2019-09-25'
                            },
                            {
                                type: 'NavDag',
                                inntekt: 1430.77,
                                dato: '2019-09-26',
                                utbetaling: 1431
                            },
                            {
                                type: 'NavDag',
                                inntekt: 1430.77,
                                dato: '2019-09-27',
                                utbetaling: 1431
                            },
                            {
                                type: 'NavHelgDag',
                                inntekt: 0.0,
                                dato: '2019-09-28'
                            },
                            {
                                type: 'NavHelgDag',
                                inntekt: 0.0,
                                dato: '2019-09-29'
                            },
                            {
                                type: 'NavDag',
                                inntekt: 1430.77,
                                dato: '2019-09-30',
                                utbetaling: 1431
                            },
                            {
                                type: 'Fridag',
                                inntekt: 1430.77,
                                dato: '2019-10-01'
                            },
                            {
                                type: 'Fridag',
                                inntekt: 1430.77,
                                dato: '2019-10-02'
                            },
                            {
                                type: 'Fridag',
                                inntekt: 1430.77,
                                dato: '2019-10-03'
                            },
                            {
                                type: 'Fridag',
                                inntekt: 1430.77,
                                dato: '2019-10-04'
                            },
                            {
                                type: 'NavHelgDag',
                                inntekt: 0.0,
                                dato: '2019-10-05'
                            }
                        ]
                    }
                }
            ]
        }
    ],
    personinfo: {
        navn: 'Ole Brum',
        kjønn: 'Mannebjørn',
        fødselsdato: '1956-12-12',
        fnr: '01019000123'
    },
    sendtSøknad: {
        fom: '2019-09-16',
        tom: '2019-10-05',
        rapportertdato: '2020-02-14T12:00:15.730199',
        sendtNav: '2019-10-15T00:00:00',
        type: 'SENDT_SØKNAD'
    },
    inntektsmelding: {
        beregnetInntekt: 31000.0,
        førsteFraværsdag: '2019-09-10',
        type: 'INNTEKTSMELDING'
    }
};
