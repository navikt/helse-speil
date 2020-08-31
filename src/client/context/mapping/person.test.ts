import { mapPerson } from './person';
import { Aktivitet, Dagtype, Kildetype, Vedtaksperiode } from '../types.internal';
import { somDato, somTidspunkt } from './vedtaksperiode';
import {
    SpleisSykdomsdag,
    SpleisSykdomsdagkildeType,
    SpleisSykdomsdagtype,
    SpleisUtbetalingsdagtype,
} from './types.external';
import { enVedtaksperiode } from './testdata/enVedtaksperiode';
import { enArbeidsgiver } from './testdata/enArbeidsgiver';
import { enPerson } from './testdata/enPerson';
import { mappetPerson } from './testdata/mappetPerson';
import { defaultPersonInfo } from './testdata/defaultPersonInfo';
import { enAktivitet } from './testdata/enAktivitetslogg';
import dayjs from 'dayjs';
import { ISO_TIDSPUNKTFORMAT } from '../../utils/date';

describe('personmapper', async () => {
    test('mapper person', async () => {
        const person = await mapPerson(enPerson(), defaultPersonInfo);
        expect(person).toEqual(mappetPerson);
    });

    test('mapper aktivitetslogg', async () => {
        const melding = 'Aktivitetsvarsel';
        const tidsstempel = '2020-01-01T13:37:00.000Z';
        const alvorlighetsgrad = 'W';
        const spleisAktivitet = enAktivitet(melding, tidsstempel, alvorlighetsgrad);

        const person = await mapPerson(
            enPerson([enArbeidsgiver([enVedtaksperiode([], [], [spleisAktivitet])])]),
            defaultPersonInfo
        );

        const aktivitetslog = (person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode).aktivitetslog;

        expect(aktivitetslog).toHaveLength(1);
        const expectedAktivitet: Aktivitet = {
            melding: melding,
            alvorlighetsgrad: alvorlighetsgrad,
            tidsstempel: somTidspunkt(tidsstempel),
        };
        expect(aktivitetslog).toContainEqual(expectedAktivitet);
    });

    test('mapper person med flere vedtaksperioder', async () => {
        let person = await mapPerson(
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
                                utbetaling: 1000.0,
                            },
                            {
                                type: SpleisUtbetalingsdagtype.NAVDAG,
                                inntekt: 999.5,
                                dato: '2019-10-07',
                                utbetaling: 1000.0,
                            },
                            {
                                type: SpleisUtbetalingsdagtype.NAVDAG,
                                inntekt: 999.5,
                                dato: '2019-10-08',
                                utbetaling: 1000.0,
                            },
                            {
                                type: SpleisUtbetalingsdagtype.NAVDAG,
                                inntekt: 999.5,
                                dato: '2019-10-09',
                                utbetaling: 1000.0,
                            },
                        ]
                    ),
                ]),
            ]),
            defaultPersonInfo
        );

        const andreVvedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[1] as Vedtaksperiode;
        expect(andreVvedtaksperiode.oppsummering.totaltTilUtbetaling).toEqual(4000.0);
        expect(andreVvedtaksperiode.oppsummering.antallUtbetalingsdager).toEqual(4);
    });

    test('filtrerer vekk paddede arbeidsdager', async () => {
        const ledendeArbeidsdager: SpleisSykdomsdag[] = [
            {
                dagen: '2019-09-08',
                type: SpleisSykdomsdagtype.ARBEIDSDAG,
                kilde: {
                    kildeId: '0F89BC6F-EDB2-4ED4-B124-19F0DF59545C',
                    type: SpleisSykdomsdagkildeType.INNTEKTSMELDING,
                },
                grad: 100.0,
            },
            {
                dagen: '2019-09-09',
                type: SpleisSykdomsdagtype.ARBEIDSDAG,
                kilde: {
                    kildeId: '62F0A473-82D1-4A38-9B8F-E220ACF598C9',
                    type: SpleisSykdomsdagkildeType.INNTEKTSMELDING,
                },
                grad: 100.0,
            },
        ];

        const person = await mapPerson(
            enPerson([enArbeidsgiver([enVedtaksperiode(ledendeArbeidsdager)])]),
            defaultPersonInfo
        );

        expect((person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode).sykdomstidslinje[0]).toEqual({
            dato: somDato('2019-09-10'),
            type: Dagtype.Egenmelding,
            kilde: Kildetype.Inntektsmelding,
            kildeId: '512781D2-690E-4B4B-8A00-84A5FCC41AEE',
            gradering: undefined,
        });
    });

    test('Vedtaksperioder sorteres på fom i synkende rekkefølge', async () => {
        const person = await mapPerson(
            enPerson([
                enArbeidsgiver([
                    enVedtaksperiode([
                        {
                            dagen: '2019-09-09',
                            type: SpleisSykdomsdagtype.SYKEDAG,
                            kilde: {
                                kildeId: '1D7B00B8-216D-4090-8DEA-72E97183F8D7',
                                type: SpleisSykdomsdagkildeType.SYKMELDING,
                            },
                        },
                    ]),
                    enVedtaksperiode(),
                ]),
            ]),
            defaultPersonInfo
        );

        const vedtaksperioder = person.arbeidsgivere[0].vedtaksperioder;
        expect(vedtaksperioder[0].fom).toStrictEqual(somDato('2019-09-10'));
        expect(vedtaksperioder[1].fom).toStrictEqual(somDato('2019-09-09'));
    });

    test('mapper overstyring av tidslinje', async () => {
        const saksbehandlerKildeId = '5B807A30-E197-474F-9AFB-D136649A02DB';
        const overstyrtDato = '2019-10-07';
        const ekstraDager: SpleisSykdomsdag[] = [
            {
                dagen: '2019-10-06',
                type: SpleisSykdomsdagtype.SYK_HELGEDAG,
                kilde: {
                    type: SpleisSykdomsdagkildeType.SØKNAD,
                    kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                },
            },
            {
                dagen: overstyrtDato,
                type: SpleisSykdomsdagtype.FERIEDAG,
                kilde: {
                    type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
                    kildeId: saksbehandlerKildeId,
                },
            },
        ];
        const person = await mapPerson(
            enPerson([
                enArbeidsgiver(
                    [enVedtaksperiode(ekstraDager)],
                    [
                        {
                            begrunnelse: 'begrunnelse',
                            hendelseId: saksbehandlerKildeId,
                            unntaFraInnsyn: false,
                            timestamp: dayjs().format(ISO_TIDSPUNKTFORMAT),
                            overstyrteDager: [
                                {
                                    dagtype: SpleisSykdomsdagtype.FERIEDAG,
                                    dato: overstyrtDato,
                                    grad: undefined,
                                },
                            ],
                        },
                    ]
                ),
            ]),
            defaultPersonInfo
        );

        const førsteVedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode;
        const hendelseId: string = førsteVedtaksperiode.sykdomstidslinje[
            førsteVedtaksperiode.sykdomstidslinje.length - 1
        ].kildeId!;

        expect(hendelseId).toBeDefined();
        expect(person.arbeidsgivere[0].overstyringer.size).toBe(1);

        const overstyring = person.arbeidsgivere[0].overstyringer.get(hendelseId)!;
        expect(overstyring).toBeDefined();
        expect(overstyring.begrunnelse).toBe('begrunnelse');
        expect(overstyring.hendelseId).toBe(saksbehandlerKildeId);
        expect(overstyring.overstyrteDager).toHaveLength(1);
        expect(overstyring.timestamp).toBeDefined();
        expect(overstyring.unntaFraInnsyn).toBeFalsy();
    });
});
