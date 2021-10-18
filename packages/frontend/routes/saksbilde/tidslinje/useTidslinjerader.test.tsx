import { renderHook } from '@testing-library/react-hooks';
import dayjs, { Dayjs } from 'dayjs';
import { mappetPerson } from 'test-data';

import { umappetArbeidsgiver } from '../../../test/data/arbeidsgiver';
import { testArbeidsgiverfagsystemId } from '../../../test/data/person';
import { umappetUtbetalingshistorikk } from '../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';
import { useTidslinjerader } from './useTidslinjerader';

let person = mappetPerson();

describe('useTidslinjerader', () => {
    beforeEach(() => {
        person = mappetPerson();
    });

    test('ett utbetalingshistorikkelement medfører én tidslinjerad', () => {
        person = mappetPerson([
            umappetArbeidsgiver(
                [umappetVedtaksperiode({ beregningIder: ['1234'] })],
                [],
                [umappetUtbetalingshistorikk('1234')]
            ),
        ]);
        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-31'), false));
        expect(result.current[0].rader.length).toEqual(1);
        expect(result.current[0].rader[0].perioder.length).toEqual(1);
        expect(result.current[0].rader[0].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].end.isSame(dayjs('2018-01-31'), 'day')).toBe(true);
    });

    test('to utbetalingshistorikkelementer med én revurdering medfører to tidslinjerader', () => {
        person = mappetPerson([
            umappetArbeidsgiver(
                [umappetVedtaksperiode({ beregningIder: ['1234', '1235'] })],
                [],
                [umappetUtbetalingshistorikk('1234'), umappetUtbetalingshistorikk('1235', 'REVURDERING')]
            ),
        ]);

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-31'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[0].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[1].perioder[0].end.isSame(dayjs('2018-01-31'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].end.isSame(dayjs('2018-01-31'), 'day')).toBe(true);
    });

    test('tre utbetalingshistorikkelementer med utb. - rev. - utb. medfører to tidslinjerader', () => {
        person = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'id1',
                        beregningIder: ['1234', '1235'],
                        fom: '2018-01-01',
                        tom: '2018-01-02',
                    }),
                    umappetVedtaksperiode({
                        id: 'id2',
                        beregningIder: ['1236'],
                        fom: '2018-01-03',
                        tom: '2018-01-04',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('1234', 'vid1', 'UTBETALING', 'UTBETALT', dayjs('2018-01-01T00:00:00')),
                    umappetUtbetalingshistorikk(
                        '1235',
                        'vid1',
                        'REVURDERING',
                        'UTBETALT',
                        dayjs('2018-01-02T00:00:00')
                    ),
                    umappetUtbetalingshistorikk('1236', 'vid1', 'UTBETALING', 'UTBETALT', dayjs('2018-01-03T00:00:00')),
                ]
            ),
        ]);

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-31'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[1].perioder.length).toEqual(1);
        expect(result.current[0].rader[0].perioder.length).toEqual(2);
        expect(result.current[0].rader[1].perioder[0].start.endOf('day')).toEqual(dayjs('2018-01-01').endOf('day'));
        expect(result.current[0].rader[1].perioder[0].end.endOf('day')).toEqual(dayjs('2018-01-02').endOf('day'));
        expect(result.current[0].rader[0].perioder[1].start.endOf('day')).toEqual(dayjs('2018-01-03').endOf('day'));
        expect(result.current[0].rader[0].perioder[1].end.endOf('day')).toEqual(dayjs('2018-01-04').endOf('day'));
        expect(result.current[0].rader[0].perioder[0].start.endOf('day')).toEqual(dayjs('2018-01-01').endOf('day'));
        expect(result.current[0].rader[0].perioder[0].end.endOf('day')).toEqual(dayjs('2018-01-02').endOf('day'));
    });

    test('to vedtaksperioder som så er annullert medfører to linjer med to utbetalte perioder og to annullerte perioder', () => {
        person = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({
                        id: 'id1',
                        beregningIder: ['1234'],
                        fom: '2018-01-01',
                        tom: '2018-01-02',
                        fagsystemId: testArbeidsgiverfagsystemId,
                    }),
                    umappetVedtaksperiode({
                        id: 'id2',
                        beregningIder: ['1235'],
                        fom: '2018-01-03',
                        tom: '2018-01-04',
                        fagsystemId: testArbeidsgiverfagsystemId,
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('1234'),
                    umappetUtbetalingshistorikk('1235', 'vid1', 'UTBETALING', 'UTBETALT', dayjs('2018-01-02T00:00:00')),
                    umappetUtbetalingshistorikk(
                        '1236',
                        'vid1',
                        'ANNULLERING',
                        'ANNULLERT',
                        dayjs('2018-01-03T00:00:00')
                    ),
                ]
            ),
        ]);

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-31'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[0].perioder.length).toEqual(2);
        expect(result.current[0].rader[1].perioder.length).toEqual(2);
        expect(result.current[0].rader[1].perioder[0].tilstand).toEqual('utbetaltAutomatisk');
        expect(result.current[0].rader[1].perioder[1].tilstand).toEqual('utbetaltAutomatisk');
        expect(result.current[0].rader[0].perioder[0].tilstand).toEqual('annullert');
        expect(result.current[0].rader[0].perioder[1].tilstand).toEqual('annullert');
    });

    test('to vedtaksperioder der første blir revurdert medfører to tidslinjerader med to perioder på hver', () => {
        person = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({ beregningIder: ['1234', '1236'], fagsystemId: 'EN_FAGSYSTEMID' }),
                    umappetVedtaksperiode({
                        id: 'id2',
                        beregningIder: ['1235', '1236'],
                        fom: '2018-01-03',
                        tom: '2018-01-04',
                        fagsystemId: 'EN_FAGSYSTEMID',
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('1234'),
                    umappetUtbetalingshistorikk('1235', 'vid1', 'UTBETALING', 'UTBETALT', dayjs('2018-01-02T00:00:00')),
                    {
                        ...umappetUtbetalingshistorikk(
                            '1236',
                            'vid1',
                            'REVURDERING',
                            'UTBETALT',
                            dayjs('2018-01-03T00:00:00')
                        ),
                        utbetaling: {
                            ...umappetUtbetalingshistorikk(
                                '1236',
                                'vid1',
                                'REVURDERING',
                                'UTBETALT',
                                dayjs('2018-01-03T00:00:00')
                            ).utbetaling,
                            utbetalingstidslinje: [
                                {
                                    type: 'NavDag',
                                    inntekt: 1431,
                                    dato: '2018-01-01',
                                },
                                {
                                    type: 'NavDag',
                                    inntekt: 1431,
                                    dato: '2018-01-02',
                                },
                                {
                                    type: 'NavDag',
                                    inntekt: 1431,
                                    dato: '2018-01-03',
                                },
                            ],
                        },
                    },
                ]
            ),
        ]);

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-31'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[0].perioder.length).toEqual(2);
        expect(result.current[0].rader[1].perioder.length).toEqual(2);
        expect(result.current[0].rader[1].perioder[0].tilstand).toEqual('utbetaltAutomatisk');
        expect(result.current[0].rader[1].perioder[1].tilstand).toEqual('utbetaltAutomatisk');
        expect(result.current[0].rader[0].perioder[0].tilstand).toEqual('revurdert');
        expect(result.current[0].rader[0].perioder[1].tilstand).toEqual('revurdert');
    });
});

export const utbetalingstidslinje = (fom: Dayjs, tom: Dayjs, dagtype: Dag['type'] = 'Syk') => {
    const antallDager = Math.abs(tom.diff(fom, 'day')) + 1;
    const utbetalingsdager: Utbetalingsdag[] = [];
    for (let step = 0; step < antallDager; step++) {
        utbetalingsdager.push({
            dato: fom.add(step, 'day'),
            type: dagtype,
        });
    }
    return utbetalingsdager;
};
