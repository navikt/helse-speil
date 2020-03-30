import { tilPerson } from './personmapper';
import { Dagtype, Kildetype, Vedtaksperiode } from '../types';
import { somDato } from './vedtaksperiodemapper';
import { SpleisSykdomsdag, SpleisSykdomsdagtype, SpleisUtbetalingsdagtype } from './external.types';
import { enVedtaksperiode } from './testdata/enVedtaksperiode';
import { enArbeidsgiver } from './testdata/enArbeidsgiver';
import { enPerson } from './testdata/enPerson';
import { mappetPerson } from './testdata/mappetPerson';
import { defaultPersonInfo } from './testdata/defaultPersonInfo';

describe('personmapper', () => {
    test('mapper person', () => {
        let person = tilPerson(enPerson(), defaultPersonInfo);
        expect(person).toEqual(mappetPerson);
    });

    test('mapper person med flere vedtaksperioder', () => {
        let person = tilPerson(
            enPerson([
                enArbeidsgiver([
                    enVedtaksperiode(),
                    enVedtaksperiode(
                        [],
                        [
                            {
                                type: SpleisUtbetalingsdagtype.NAVDAG,
                                inntekt: 999.5,
                                dato: '2019-10-06',
                                utbetaling: 1000.0
                            },
                            {
                                type: SpleisUtbetalingsdagtype.NAVDAG,
                                inntekt: 999.5,
                                dato: '2019-10-07',
                                utbetaling: 1000.0
                            },
                            {
                                type: SpleisUtbetalingsdagtype.NAVDAG,
                                inntekt: 999.5,
                                dato: '2019-10-08',
                                utbetaling: 1000.0
                            },
                            {
                                type: SpleisUtbetalingsdagtype.NAVDAG,
                                inntekt: 999.5,
                                dato: '2019-10-09',
                                utbetaling: 1000.0
                            }
                        ]
                    )
                ])
            ]),
            defaultPersonInfo
        );

        const andreVvedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[1] as Vedtaksperiode;
        expect(andreVvedtaksperiode.oppsummering.totaltTilUtbetaling).toEqual(4000.0);
        expect(andreVvedtaksperiode.oppsummering.antallUtbetalingsdager).toEqual(4);
    });

    test('filtrerer vekk paddede arbeidsdager', () => {
        const ledendeArbeidsdager: SpleisSykdomsdag[] = [
            {
                dagen: '2019-09-08',
                type: SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING,
                grad: 100.0
            },
            {
                dagen: '2019-09-09',
                type: SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING,
                grad: 100.0
            }
        ];

        const person = tilPerson(
            enPerson([enArbeidsgiver([enVedtaksperiode(ledendeArbeidsdager)])]),
            defaultPersonInfo
        );

        expect((person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode).sykdomstidslinje[0]).toEqual({
            dato: somDato('2019-09-10'),
            type: Dagtype.Egenmelding,
            kilde: Kildetype.Inntektsmelding,
            gradering: undefined
        });
    });

    test('Vedtaksperioder sorteres på fom i synkende rekkefølge', () => {
        const person = tilPerson(
            enPerson([
                enArbeidsgiver([
                    enVedtaksperiode([
                        {
                            dagen: '2019-09-09',
                            type: SpleisSykdomsdagtype.SYKEDAG_SYKMELDING
                        }
                    ]),
                    enVedtaksperiode()
                ])
            ]),
            defaultPersonInfo
        );

        const vedtaksperioder = person.arbeidsgivere[0].vedtaksperioder;
        expect(vedtaksperioder[0].fom).toStrictEqual(somDato('2019-09-10'));
        expect(vedtaksperioder[1].fom).toStrictEqual(somDato('2019-09-09'));
    });
});
