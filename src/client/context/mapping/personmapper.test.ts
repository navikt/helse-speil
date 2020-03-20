// @ts-nocheck
import { tilPerson } from './personmapper';
import { Dagtype, Hendelsestype, Kildetype, Kjønn, Vedtaksperiodetilstand } from '../types';
import { somDato, somTidspunkt } from './vedtaksperiodemapper';
import { SpleisHendelse, SpleisHendelsetype, SpleisSykdomsdagtype, SpleisVedtaksperiode } from './external.types';
import { Personinfo as SpleisPersoninfo, SpleisVedtaksperiodetilstand } from '../../../types';

test('mapper person', () => {
    let person = tilPerson(enPerson(), personInfo);
    expect(person).toEqual(mappetPerson);
});

test('mapper person med flere vedtaksperioder', () => {
    let person = tilPerson(
        enPerson([
            enArbeidsgiver([
                enVedtaksperiode(),
                enVedtaksperiode([], vilkårsvurdering(), [
                    {
                        type: 'NavDag',
                        inntekt: 999.5,
                        dato: '2019-10-06',
                        utbetaling: 1000.0
                    },
                    {
                        type: 'NavDag',
                        inntekt: 999.5,
                        dato: '2019-10-07',
                        utbetaling: 1000.0
                    },
                    {
                        type: 'NavDag',
                        inntekt: 999.5,
                        dato: '2019-10-08',
                        utbetaling: 1000.0
                    },
                    {
                        type: 'NavDag',
                        inntekt: 999.5,
                        dato: '2019-10-09',
                        utbetaling: 1000.0
                    }
                ])
            ])
        ]),
        personInfo
    );

    expect(person.arbeidsgivere[0].vedtaksperioder[1].oppsummering.totaltTilUtbetaling).toEqual(4000.0);

    expect(person.arbeidsgivere[0].vedtaksperioder[1].oppsummering.antallUtbetalingsdager).toEqual(4);
});

test('filtrerer vekk paddede arbeidsdager', () => {
    const ledendeArbeidsdager = [enArbeidsdag('2019-09-08'), enArbeidsdag('2019-09-09')];

    const person = tilPerson(enPerson([enArbeidsgiver([enVedtaksperiode(ledendeArbeidsdager)])]), personInfo);

    expect(person.arbeidsgivere[0].vedtaksperioder[0].sykdomstidslinje[0]).toEqual({
        dato: somDato('2019-09-10'),
        type: Dagtype.Egenmelding,
        kilde: Kildetype.Inntektsmelding,
        gradering: undefined
    });
});

test('Opptjening er undefined dersom felter er satt til null', () => {
    const person = tilPerson(enPerson([enArbeidsgiver([enVedtaksperiode([], vilkårsvurdering(false))])]), personInfo);
    const vedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[0];
    expect(vedtaksperiode.vilkår.opptjening).toBeUndefined();
});

test('Vedtaksperioder sorteres på fom i synkende rekkefølge', () => {
    const person = tilPerson(
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
    expect(vedtaksperioder[0].fom).toStrictEqual(somDato('2019-09-10'));
    expect(vedtaksperioder[1].fom).toStrictEqual(somDato('2019-09-09'));
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

const enVedtaksperiode = (
    ekstraDager = [],
    _vilkårsvurdering = vilkårsvurdering(),
    _utbetalingstidslinje: Utbetalingsdag[] = defaultUtbetalingstidslinje
): SpleisVedtaksperiode => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        maksdato: '2020-09-07',
        forbrukteSykedager: 3,
        godkjentAv: null,
        utbetalingsreferanse: '12345',
        førsteFraværsdag: '2019-09-10',
        inntektFraInntektsmelding: 31000.0,
        dataForVilkårsvurdering: _vilkårsvurdering,
        tilstand: 'AVVENTER_GODKJENNING',
        hendelser: [
            '726e57d9-7844-4a28-886b-8485dbdbd4d2',
            '09851096-bcba-4c7a-8dc0-a1617a744f1f',
            'c554ee9b-30ca-4c7f-adce-c0224108e83a'
        ],
        sykdomstidslinje: [
            ...ekstraDager,
            {
                dagen: '2019-09-10',
                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
            },
            {
                dagen: '2019-09-11',
                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
            },
            {
                dagen: '2019-09-12',
                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
            },
            {
                dagen: '2019-09-13',
                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
            },
            {
                dagen: '2019-09-14',
                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
            },
            {
                dagen: '2019-09-15',
                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
            },
            {
                dagen: '2019-09-16',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-17',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-18',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-19',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-20',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-21',
                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
            },
            {
                dagen: '2019-09-22',
                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
            },
            {
                dagen: '2019-09-23',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-24',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-25',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-26',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-27',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-09-28',
                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
            },
            {
                dagen: '2019-09-29',
                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
            },
            {
                dagen: '2019-09-30',
                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
            },
            {
                dagen: '2019-10-01',
                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
            },
            {
                dagen: '2019-10-02',
                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
            },
            {
                dagen: '2019-10-03',
                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
            },
            {
                dagen: '2019-10-04',
                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
            },
            {
                dagen: '2019-10-05',
                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
            }
        ],
        utbetalingslinjer: [
            {
                fom: '2019-09-26',
                tom: '2019-09-30',
                dagsats: 1431
            }
        ],
        utbetalingstidslinje: _utbetalingstidslinje
    };
};

const defaultUtbetalingstidslinje = [
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
];

const enArbeidsdag = dato => ({
    dato: dato,
    type: 'ARBEIDSDAG_INNTEKTSMELDING'
});

const hendelser: SpleisHendelse[] = [
    {
        hendelseId: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
        rapportertdato: '2020-02-14',
        fom: '2019-09-01',
        tom: '2019-10-10',
        type: SpleisHendelsetype.SYKMELDING
    },
    {
        hendelseId: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
        rapportertdato: '2020-02-14',
        sendtNav: '2019-10-15',
        fom: '2019-09-01',
        tom: '2019-10-10',
        type: SpleisHendelsetype.SØKNAD
    },
    {
        hendelseId: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
        beregnetInntekt: 31000.0,
        førsteFraværsdag: '2019-09-01',
        mottattDato: '2019-10-15T00:00:00',
        type: SpleisHendelsetype.INNTEKTSMELDING
    }
];

const personInfo: SpleisPersoninfo = {
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
                    fom: somDato('2019-09-10'),
                    tom: somDato('2019-10-05'),
                    godkjentAv: null,
                    godkjenttidspunkt: undefined,
                    tilstand: Vedtaksperiodetilstand.Oppgaver,
                    kanVelges: true,
                    vilkår: {
                        dagerIgjen: {
                            dagerBrukt: 3,
                            førsteFraværsdag: somDato('2019-09-01'),
                            førsteSykepengedag: somDato('2019-09-26'),
                            maksdato: somDato('2020-09-07'),
                            tidligerePerioder: []
                        },
                        søknadsfrist: {
                            innen3Mnd: true,
                            søknadTom: somDato('2019-10-10'),
                            sendtNav: somTidspunkt('2019-10-15T00:00:00')
                        },
                        opptjening: {
                            antallOpptjeningsdagerErMinst: 3539,
                            opptjeningFra: somDato('2010-01-01'),
                            harOpptjening: true
                        },
                        alderISykmeldingsperioden: 62
                    },
                    utbetalingstidslinje: [
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-10'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-11'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-12'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-13'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-14'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-15'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-16'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-17'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-18'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-19'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-20'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-21'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-22'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-23'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-24'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: 'Arbeidsgiverperiode',
                            dato: somDato('2019-09-25'),
                            gradering: undefined,
                            utbetaling: undefined
                        },
                        {
                            type: Dagtype.Syk,
                            dato: somDato('2019-09-26'),
                            gradering: undefined,
                            utbetaling: 1431
                        },
                        {
                            type: Dagtype.Syk,
                            dato: somDato('2019-09-27'),
                            gradering: undefined,
                            utbetaling: 1431
                        },
                        {
                            type: Dagtype.Helg,
                            gradering: undefined,
                            dato: somDato('2019-09-28'),
                            utbetaling: undefined
                        },
                        {
                            type: Dagtype.Helg,
                            gradering: undefined,
                            dato: somDato('2019-09-29'),
                            utbetaling: undefined
                        },
                        {
                            type: Dagtype.Syk,
                            gradering: undefined,
                            dato: somDato('2019-09-30'),
                            utbetaling: 1431
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-01')
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-02'),
                            utbetaling: undefined
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-03'),
                            utbetaling: undefined
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-04'),
                            utbetaling: undefined
                        },
                        {
                            type: Dagtype.Helg,
                            gradering: undefined,
                            dato: somDato('2019-10-05'),
                            utbetaling: undefined
                        }
                    ],
                    sykdomstidslinje: [
                        {
                            dato: somDato('2019-09-10'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-11'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-12'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-13'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-14'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-15'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-16'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-17'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-18'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-19'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-20'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-21'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-22'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-23'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-24'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-25'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-26'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-27'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-28'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-29'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-09-30'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-10-01'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-10-02'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-10-03'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-10-04'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
                        },
                        {
                            dato: somDato('2019-10-05'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            gradering: undefined
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
                            refusjon: true,
                            forskuttering: true
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
                        forbrukteSykedager: 3,
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
                        hendelser: [
                            '726e57d9-7844-4a28-886b-8485dbdbd4d2',
                            '09851096-bcba-4c7a-8dc0-a1617a744f1f',
                            'c554ee9b-30ca-4c7f-adce-c0224108e83a'
                        ],
                        tilstand: SpleisVedtaksperiodetilstand.AVVENTER_GODKJENNING,
                        sykdomstidslinje: [
                            {
                                dagen: '2019-09-10',
                                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
                            },
                            {
                                dagen: '2019-09-11',
                                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
                            },
                            {
                                dagen: '2019-09-12',
                                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
                            },
                            {
                                dagen: '2019-09-13',
                                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
                            },
                            {
                                dagen: '2019-09-14',
                                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
                            },
                            {
                                dagen: '2019-09-15',
                                type: SpleisSykdomsdagtype.EGENMELDINGSDAG_INNTEKTSMELDING
                            },
                            {
                                dagen: '2019-09-16',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-17',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-18',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-19',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-20',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-21',
                                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-09-22',
                                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-09-23',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-24',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-25',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-26',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-27',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-09-28',
                                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-09-29',
                                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-09-30',
                                type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                            },
                            {
                                dagen: '2019-10-01',
                                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-10-02',
                                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-10-03',
                                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-10-04',
                                type: SpleisSykdomsdagtype.FERIEDAG_SØKNAD
                            },
                            {
                                dagen: '2019-10-05',
                                type: SpleisSykdomsdagtype.SYK_HELGEDAG_SØKNAD
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
                    },
                    dokumenter: [
                        {
                            id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
                            fom: somDato('2019-09-01'),
                            tom: somDato('2019-10-10'),
                            rapportertDato: somDato('2020-02-14'),
                            sendtNav: somDato('2019-10-15'),
                            type: Hendelsestype.Søknad
                        },
                        {
                            id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
                            fom: somDato('2019-09-01'),
                            tom: somDato('2019-10-10'),
                            rapportertDato: somDato('2020-02-14'),
                            type: Hendelsestype.Sykmelding
                        },
                        {
                            id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
                            beregnetInntekt: 31000,
                            førsteFraværsdag: somDato('2019-09-01'),
                            mottattTidspunkt: somTidspunkt('2019-10-15T00:00:00'),
                            type: Hendelsestype.Inntektsmelding
                        }
                    ]
                }
            ]
        }
    ],
    hendelser: [
        {
            id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
            rapportertDato: somDato('2020-02-14'),
            fom: somDato('2019-09-01'),
            tom: somDato('2019-10-10'),
            type: Hendelsestype.Sykmelding
        },
        {
            id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
            rapportertDato: somDato('2020-02-14'),
            sendtNav: somDato('2019-10-15'),
            fom: somDato('2019-09-01'),
            tom: somDato('2019-10-10'),
            type: Hendelsestype.Søknad
        },
        {
            id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
            beregnetInntekt: 31000.0,
            førsteFraværsdag: somDato('2019-09-01'),
            mottattTidspunkt: somTidspunkt('2019-10-15T00:00:00'),
            type: Hendelsestype.Inntektsmelding
        }
    ],
    personinfo: {
        navn: 'Ole Brum',
        kjønn: 'Mannebjørn' as Kjønn,
        fødselsdato: somDato('1956-12-12'),
        fnr: '01019000123'
    }
};
