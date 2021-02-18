import dayjs from 'dayjs';
import { Dagtype, Kildetype } from 'internal-types';
import { useTidslinjerader } from './useTidslinjerader';
import { mappetPersonObject } from '../../../test/data/person';
import { renderHook } from '@testing-library/react-hooks';

let person = mappetPersonObject;

describe('useTidslinjerader', () => {
    beforeEach(() => {
        person = mappetPersonObject;
        person.arbeidsgivere[0].vedtaksperioder[0].fom = dayjs('2018-01-01');
        person.arbeidsgivere[0].vedtaksperioder[0].tom = dayjs('2018-01-02');
        person.arbeidsgivere[0].vedtaksperioder[0].beregningId = '1234';
    });

    test('ett utbetalingshistorikkelement medfører én tidslinjerad', () => {
        person.arbeidsgivere[0].utbetalingshistorikk = [
            {
                id: '1234',
                beregnettidslinje: [
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-01T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-02T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                ],
                hendelsetidslinje: [],
                utbetalinger: [
                    {
                        status: 'IKKE_UTBETALT',
                        type: 'UTBETALING',
                        utbetalingstidslinje: [],
                    },
                ],
            },
        ];
        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-31'), false));
        expect(result.current[0].rader.length).toEqual(1);
    });

    test('to utbetalingshistorikkelementer med én revurdering medfører to tidslinjerader', () => {
        person.arbeidsgivere[0].vedtaksperioder[0].fom = dayjs('2018-01-01');
        person.arbeidsgivere[0].vedtaksperioder[0].tom = dayjs('2018-01-02');
        person.arbeidsgivere[0].vedtaksperioder[0].beregningId = '1234';
        person.arbeidsgivere[0].utbetalingshistorikk = [
            {
                id: '1235',
                beregnettidslinje: [
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-01T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-02T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                ],
                hendelsetidslinje: [],
                utbetalinger: [
                    {
                        status: 'IKKE_UTBETALT',
                        type: 'REVURDERING',
                        utbetalingstidslinje: [],
                    },
                ],
            },
            {
                id: '1234',
                beregnettidslinje: [
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-01T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-02T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                ],
                hendelsetidslinje: [],
                utbetalinger: [
                    {
                        status: 'IKKE_UTBETALT',
                        type: 'UTBETALING',
                        utbetalingstidslinje: [],
                    },
                ],
            },
        ];

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-02'), false));
        expect(result.current[0].rader.length).toEqual(2);
    });

    test('tre utbetalingshistorikkelementer med utb. - rev. - utb. medfører to tidslinjerader', () => {
        person.arbeidsgivere[0].vedtaksperioder.push({
            ...person.arbeidsgivere[0].vedtaksperioder[0],
            fom: dayjs('2018-01-03'),
            tom: dayjs('2018-01-04'),
            beregningId: '1236',
        });
        person.arbeidsgivere[0].utbetalingshistorikk = [
            {
                id: '1236',
                beregnettidslinje: [
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-01T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-02T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-03T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-04T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                ],
                hendelsetidslinje: [],
                utbetalinger: [
                    {
                        status: 'IKKE_UTBETALT',
                        type: 'UTBETALING',
                        utbetalingstidslinje: [],
                    },
                ],
            },
            {
                id: '1235',
                beregnettidslinje: [
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-01T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-02T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                ],
                hendelsetidslinje: [],
                utbetalinger: [
                    {
                        status: 'IKKE_UTBETALT',
                        type: 'REVURDERING',
                        utbetalingstidslinje: [],
                    },
                ],
            },
            {
                id: '1234',
                beregnettidslinje: [
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-01T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                    {
                        type: Dagtype.Syk,
                        dato: dayjs('2018-01-02T00:00:00.000Z'),
                        kilde: Kildetype.Sykmelding,
                        kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                        gradering: 100,
                    },
                ],
                hendelsetidslinje: [],
                utbetalinger: [
                    {
                        status: 'IKKE_UTBETALT',
                        type: 'UTBETALING',
                        utbetalingstidslinje: [],
                    },
                ],
            },
        ];

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-02'), false));
        expect(result.current[0].rader.length).toEqual(2);
    });
});
