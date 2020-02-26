// @ts-nocheck
import { mapPerson } from './personmapper';
import { Inntektsmelding } from '../types';

test('mapper person', () => {
    let person = mapPerson(enPerson(), personInfo);
    expect(person).toEqual(mappetPerson);
});

test('filtrerer vekk paddede arbeidsdager', () => {
    const ledendeArbeidsdager = [enArbeidsdag('2019-09-08'), enArbeidsdag('2019-09-09')];

    const person = mapPerson(
        enPerson([enArbeidsgiver([enVedtaksperiode(ledendeArbeidsdager)])]),
        personInfo
    );

    expect(person.arbeidsgivere[0].vedtaksperioder[0].sykdomstidslinje[0]).toEqual({
        dagen: '2019-09-10',
        hendelseType: 'Inntektsmelding',
        type: 'EGENMELDINGSDAG'
    });
});

test('Opptjening er undefined dersom felter er satt til null', () => {
    const person = mapPerson(
        enPerson([enArbeidsgiver([enVedtaksperiode([], vilkårsvurdering(false))])]),
        personInfo
    );
    const vedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[0];
    expect(vedtaksperiode.inngangsvilkår.opptjening.harOpptjening).toBeNull();
    expect(vedtaksperiode.inngangsvilkår.opptjening.opptjeningFra).toBeUndefined();
});

test('Filtrerer vekk uønskede vedtaksperioder', () => {
    const person = mapPerson(
        enPerson([enArbeidsgiver([vedtaksperiodeSomVenterPåTidligere(), enVedtaksperiode()])]),
        personInfo
    );

    const vedtaksperioder = person.arbeidsgivere[0].vedtaksperioder;
    expect(vedtaksperioder.length).toBe(1);
    expect(vedtaksperioder[0].tilstand === 'AVVENTER_TIDLIGERE_PERIODE');
});

test('Vedtaksperioder sorteres på fom i synkende rekkefølge', () => {
    const person = mapPerson(
        enPerson([
            enArbeidsgiver([
                enVedtaksperiode([
                    {
                        dagen: '2019-09-09',
                        hendelseType: 'Sykmelding',
                        type: 'SYKEDAG'
                    }
                ]),
                enVedtaksperiode()
            ])
        ]),
        personInfo
    );

    const vedtaksperioder = person.arbeidsgivere[0].vedtaksperioder;
    expect(vedtaksperioder[0].fom).toBe('2019-09-10');
    expect(vedtaksperioder[1].fom).toBe('2019-09-09');
});

const enPerson = (arbeidsgivere = [enArbeidsgiver()]) => {
    return {
        aktørId: '1211109876233',
        fødselsnummer: '01019000123',
        arbeidsgivere: arbeidsgivere,
        hendelser: hendelser
    };
};

const enArbeidsgiver = (vedtaksperioder = [enVedtaksperiode()]) => {
    return {
        organisasjonsnummer: '123456789',
        id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
        utbetalingsreferanse: '1581678015629',
        vedtaksperioder: vedtaksperioder
    };
};

const vilkårsvurdering = (medOpptjening = true) => {
    return {
        erEgenAnsatt: false,
        beregnetÅrsinntektFraInntektskomponenten: 372000.0,
        avviksprosent: 0.0,
        antallOpptjeningsdagerErMinst: medOpptjening ? 3539 : null,
        harOpptjening: medOpptjening ? true : null
    };
};

const enVedtaksperiode = (ekstraDager = [], _vilkårsvurdering = vilkårsvurdering()) => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        maksdato: '2020-09-07',
        godkjentAv: null,
        utbetalingsreferanse: '12345',
        førsteFraværsdag: '2019-09-10',
        inntektFraInntektsmelding: 31000.0,
        dataForVilkårsvurdering: _vilkårsvurdering,
        tilstand: 'AVVENTER_GODKJENNING',
        sykdomstidslinje: [
            ...ekstraDager,
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
    };
};

const vedtaksperiodeSomVenterPåTidligere = () => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        maksdato: '2020-09-07',
        godkjentAv: null,
        utbetalingsreferanse: '12345',
        førsteFraværsdag: '2019-09-10',
        inntektFraInntektsmelding: 31000.0,
        dataForVilkårsvurdering: vilkårsvurdering(),
        tilstand: 'AVVENTER_TIDLIGERE_PERIODE',
        sykdomstidslinje: [
            {
                dagen: '2019-09-11',
                hendelseType: 'Inntektsmelding',
                type: 'EGENMELDINGSDAG'
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
            }
        ]
    };
};

const enArbeidsdag = dato => {
    return {
        dato: dato,
        type: 'ARBEIDSDAG_INNTEKTSMELDING'
    };
};

const hendelser = [
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
];

const personInfo = {
    navn: 'Ole Brum',
    kjønn: 'Mannebjørn',
    fødselsdato: '1956-12-12',
    fnr: '01019000123'
};

const mappetPerson = {
    fødselsnummer: '01019000123',
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
                    godkjentAv: null,
                    godkjentTidspunkt: undefined,
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
                    inntektskilder: [
                        {
                            organisasjonsnummer: '123456789',
                            månedsinntekt: 31000,
                            årsinntekt: 372000.0,
                            refusjon: 'Ja',
                            forskuttering: 'Ja'
                        }
                    ],
                    oppsummering: {
                        antallUtbetalingsdager: 3,
                        totaltTilUtbetaling: 4293
                    },
                    utbetalingsreferanse: '12345',
                    rawData: {
                        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
                        maksdato: '2020-09-07',
                        godkjentAv: null,
                        utbetalingsreferanse: '12345',
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
