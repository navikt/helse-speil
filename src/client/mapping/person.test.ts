import dayjs from 'dayjs';

import { ISO_TIDSPUNKTFORMAT } from '../utils/date';

import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { mappetPersonObject, umappetPerson } from '../../test/data/person';
import {
    medEkstraSykdomsdager,
    medLedendeSykdomsdager,
    medUtbetalingstidslinje,
    umappetVedtaksperiode,
} from '../../test/data/vedtaksperiode';
import { mapPerson } from './person';

jest.mock('nanoid', () => ({
    nanoid: () => 'nanoid',
}));

const enAktivitet = (
    melding: string = 'Aktivitetsloggvarsel',
    tidsstempel: string = '2020-04-03T07:40:47.261Z',
    alvorlighetsgrad: ExternalAktivitet['alvorlighetsgrad'] = 'W'
): ExternalAktivitet => ({
    vedtaksperiodeId: 'vedtaksperiodeId',
    alvorlighetsgrad: alvorlighetsgrad,
    melding: melding,
    tidsstempel: tidsstempel,
});

describe('personmapper', () => {
    test('mapper person', () => {
        const { person } = mapPerson(umappetPerson());
        expect(person).toEqual(mappetPersonObject());
    });

    test('mapper aktivitetslogg', () => {
        const melding = 'Aktivitetsvarsel';
        const tidsstempel = '2018-01-01T13:37:00.000Z';
        const alvorlighetsgrad = 'W';
        const spleisAktivitet = enAktivitet(melding, tidsstempel, alvorlighetsgrad);

        const vedtaksperiode = umappetVedtaksperiode({ varsler: [melding], aktivitetslogg: [spleisAktivitet] });
        const arbeidsgiver = umappetArbeidsgiver([vedtaksperiode]);
        const { person } = mapPerson(umappetPerson([arbeidsgiver]));

        const aktivitetslog = (person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode).aktivitetslog;

        expect(aktivitetslog).toHaveLength(1);
        expect(aktivitetslog).toContainEqual(melding);
    });

    test('mapper person med flere vedtaksperioder', () => {
        const { person } = mapPerson(
            umappetPerson([
                umappetArbeidsgiver([
                    umappetVedtaksperiode(),
                    medUtbetalingstidslinje(umappetVedtaksperiode(), [
                        {
                            type: 'NavDag',
                            inntekt: 999.5,
                            dato: '2019-10-06',
                            utbetaling: 1000.0,
                        },
                        {
                            type: 'NavDag',
                            inntekt: 999.5,
                            dato: '2019-10-07',
                            utbetaling: 1000.0,
                        },
                        {
                            type: 'NavDag',
                            inntekt: 999.5,
                            dato: '2019-10-08',
                            utbetaling: 1000.0,
                        },
                        {
                            type: 'NavDag',
                            inntekt: 999.5,
                            dato: '2019-10-09',
                            utbetaling: 1000.0,
                        },
                    ]),
                ]),
            ])
        );

        const andreVvedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[1] as Vedtaksperiode;
        expect(andreVvedtaksperiode.oppsummering.totaltTilUtbetaling).toEqual(4000.0);
        expect(andreVvedtaksperiode.oppsummering.antallUtbetalingsdager).toEqual(4);
    });

    test('Vedtaksperioder sorteres på fom i synkende rekkefølge', () => {
        const { person } = mapPerson(
            umappetPerson([
                umappetArbeidsgiver([
                    medLedendeSykdomsdager(umappetVedtaksperiode(), [
                        {
                            dagen: '2017-12-31',
                            type: 'SYKEDAG',
                            kilde: {
                                kildeId: '1D7B00B8-216D-4090-8DEA-72E97183F8D7',
                                type: 'Sykmelding',
                            },
                        },
                    ]),
                    umappetVedtaksperiode(),
                ]),
            ])
        );

        const vedtaksperioder = person.arbeidsgivere[0].vedtaksperioder;
        expect(vedtaksperioder[0].fom.format('YYYY-MM-DD')).toStrictEqual('2018-01-01');
        expect(vedtaksperioder[1].fom.format('YYYY-MM-DD')).toStrictEqual('2017-12-31');
    });

    test('mapper overstyring av tidslinje', () => {
        const saksbehandlerKildeId = '5B807A30-E197-474F-9AFB-D136649A02DB';
        const overstyrtDato = '2019-10-07';
        const ekstraDager: ExternalSykdomsdag[] = [
            {
                dagen: '2019-10-06',
                type: 'SYK_HELGEDAG',
                kilde: {
                    type: 'Søknad',
                    kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                },
            },
            {
                dagen: overstyrtDato,
                type: 'FERIEDAG',
                kilde: {
                    type: 'Saksbehandler',
                    kildeId: saksbehandlerKildeId,
                },
            },
        ];
        const { person } = mapPerson(
            umappetPerson([
                umappetArbeidsgiver(
                    [medEkstraSykdomsdager(umappetVedtaksperiode(), ekstraDager)],
                    [
                        {
                            type: 'Dager',
                            begrunnelse: 'begrunnelse',
                            hendelseId: saksbehandlerKildeId,
                            timestamp: dayjs().format(ISO_TIDSPUNKTFORMAT),
                            saksbehandlerNavn: 'Ola Narr',
                            saksbehandlerIdent: 'O999999',
                            overstyrteDager: [
                                {
                                    dagtype: 'FERIEDAG',
                                    dato: overstyrtDato,
                                    grad: undefined,
                                },
                            ],
                        },
                    ]
                ),
            ])
        );

        const førsteVedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode;
        const hendelseId: string =
            førsteVedtaksperiode.sykdomstidslinje[førsteVedtaksperiode.sykdomstidslinje.length - 1].kildeId!;

        expect(hendelseId).toBeDefined();
    });
});
