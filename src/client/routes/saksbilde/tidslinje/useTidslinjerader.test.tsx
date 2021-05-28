import { renderHook } from '@testing-library/react-hooks';
import dayjs, { Dayjs } from 'dayjs';
import {
    Dagtype,
    Revurderingtilstand,
    Sykdomsdag,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    Utbetalingstype,
    Vedtaksperiode,
} from 'internal-types';
import { mappetPerson } from 'test-data';

import {
    Periodetype,
    utbetalingshistorikkelement,
    UtbetalingshistorikkElement,
    Utbetalingstatus,
} from '../../../modell/UtbetalingshistorikkElement';

import { umappetArbeidsgiver } from '../../../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { tilPeriodetilstand, useTidslinjerader } from './useTidslinjerader';

type Vedtaksperioder = (Vedtaksperiode | UfullstendigVedtaksperiode)[];

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
        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2020-01-01'), dayjs('2020-01-31'), false));
        expect(result.current[0].rader.length).toEqual(1);
        expect(result.current[0].rader[0].perioder.length).toEqual(1);
        expect(result.current[0].rader[0].perioder[0].start.isSame(dayjs('2020-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].end.isSame(dayjs('2020-01-31'), 'day')).toBe(true);
    });

    test('to utbetalingshistorikkelementer med én revurdering medfører to tidslinjerader', () => {
        person = mappetPerson([
            umappetArbeidsgiver(
                [umappetVedtaksperiode({ beregningIder: ['1234', '1235'] })],
                [],
                [umappetUtbetalingshistorikk('1234'), umappetUtbetalingshistorikk('1235', true)]
            ),
        ]);

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2020-01-01'), dayjs('2020-01-31'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[0].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder[0].start.isSame(dayjs('2020-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[1].perioder[0].end.isSame(dayjs('2020-01-31'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].start.isSame(dayjs('2020-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].end.isSame(dayjs('2020-01-31'), 'day')).toBe(true);
    });

    test('tre utbetalingshistorikkelementer med utb. - rev. - utb. medfører to tidslinjerader', () => {
        person = mappetPerson([
            umappetArbeidsgiver(
                [
                    umappetVedtaksperiode({ beregningIder: ['1234', '1235'] }),
                    umappetVedtaksperiode({
                        id: 'id2',
                        beregningIder: ['1236'],
                        fom: dayjs('2020-01-03'),
                        tom: dayjs('2020-01-04'),
                    }),
                ],
                [],
                [
                    umappetUtbetalingshistorikk('1234'),
                    umappetUtbetalingshistorikk('1235', true),
                    umappetUtbetalingshistorikk('1236'),
                ]
            ),
        ]);

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2020-01-01'), dayjs('2020-01-31'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[0].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder.length).toEqual(2);
        expect(result.current[0].rader[0].perioder[0].start.endOf('day')).toEqual(dayjs('2020-01-01').endOf('day'));
        expect(result.current[0].rader[0].perioder[0].end.endOf('day')).toEqual(dayjs('2020-01-31').endOf('day'));
        expect(result.current[0].rader[1].perioder[0].start.endOf('day')).toEqual(dayjs('2020-01-03').endOf('day'));
        expect(result.current[0].rader[1].perioder[0].end.endOf('day')).toEqual(dayjs('2020-01-04').endOf('day'));
        expect(result.current[0].rader[1].perioder[1].start.endOf('day')).toEqual(dayjs('2020-01-01').endOf('day'));
        expect(result.current[0].rader[1].perioder[1].end.endOf('day')).toEqual(dayjs('2020-01-31').endOf('day'));
    });
});

describe('tilPeriodetype', () => {
    test('mapper periode til revurdering', () => {
        const tilstand = tilPeriodetilstand(Utbetalingstatus.IKKE_UTBETALT, Periodetype.REVURDERING);
        expect(tilstand).toEqual(Revurderingtilstand.Revurderes);
    });
});

const nyttElement = (
    id: string,
    fom: Dayjs,
    tom: Dayjs,
    maksdato: Dayjs,
    vedtaksperioder: Vedtaksperioder,
    erRevurdering: boolean = false,
    erUtbetalt = true
): UtbetalingshistorikkElement => {
    return utbetalingshistorikkelement(
        id,
        sykdomstidslinje(fom, tom),
        sykdomstidslinje(fom, tom),
        {
            status: erUtbetalt ? Utbetalingstatus.UTBETALT : Utbetalingstatus.IKKE_UTBETALT,
            type: erRevurdering ? Utbetalingstype.REVURDERING : Utbetalingstype.UTBETALING,
            utbetalingstidslinje: utbetalingstidslinje(fom, tom),
            maksdato: maksdato,
            gjenståendeDager: 0,
            forbrukteDager: 0,
            nettobeløp: 0,
            arbeidsgiverFagsystemId: 'EN_FAGSYSTEMID',
        }
    );
};

export const utbetalingstidslinje = (fom: Dayjs, tom: Dayjs, dagtype: Dagtype = Dagtype.Syk) => {
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

const sykdomstidslinje = (fom: Dayjs, tom: Dayjs) => {
    const antallDager = Math.abs(tom.diff(fom, 'day')) + 1;
    const sykdomsdager: Sykdomsdag[] = [];
    for (let step = 0; step < antallDager; step++) {
        sykdomsdager.push({
            dato: fom.add(step, 'day'),
            type: Dagtype.Syk,
        });
    }
    return sykdomsdager;
};
