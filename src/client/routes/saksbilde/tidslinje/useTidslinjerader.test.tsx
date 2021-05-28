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

import {
    Periodetype,
    utbetalingshistorikkelement,
    UtbetalingshistorikkElement,
    Utbetalingstatus,
} from '../../../modell/UtbetalingshistorikkElement';

import { mappetPersonObject } from '../../../../test/data/person';
import { tilPeriodetilstand, useTidslinjerader } from './useTidslinjerader';

type Vedtaksperioder = (Vedtaksperiode | UfullstendigVedtaksperiode)[];

let person = mappetPersonObject;

describe('useTidslinjerader', () => {
    const førsteVedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[0];
    const vedtaksperiodene = person.arbeidsgivere[0].vedtaksperioder;
    beforeEach(() => {
        person = mappetPersonObject;
        førsteVedtaksperiode.fom = dayjs('2018-01-01');
        førsteVedtaksperiode.tom = dayjs('2018-01-02');
        førsteVedtaksperiode.beregningIder = ['1234'];
    });

    test('ett utbetalingshistorikkelement medfører én tidslinjerad', () => {
        person.arbeidsgivere[0].utbetalingshistorikk = [
            nyttElement('1234', dayjs('2018-01-01'), dayjs('2018-01-02'), dayjs('2018-08-08'), vedtaksperiodene),
        ];
        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-31'), false));
        expect(result.current[0].rader.length).toEqual(1);
        expect(result.current[0].rader[0].perioder.length).toEqual(1);
        expect(result.current[0].rader[0].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].end.isSame(dayjs('2018-01-02'), 'day')).toBe(true);
    });

    test('to utbetalingshistorikkelementer med én revurdering medfører to tidslinjerader', () => {
        person.arbeidsgivere[0].utbetalingshistorikk = [
            nyttElement('1235', dayjs('2018-01-01'), dayjs('2018-01-02'), dayjs('2018-08-08'), vedtaksperiodene, true),
            nyttElement('1234', dayjs('2018-01-01'), dayjs('2018-01-02'), dayjs('2018-08-08'), vedtaksperiodene),
        ];

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-02'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[0].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[1].perioder[0].end.isSame(dayjs('2018-01-02'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].end.isSame(dayjs('2018-01-02'), 'day')).toBe(true);
    });

    test('tre utbetalingshistorikkelementer med utb. - rev. - utb. medfører to tidslinjerader', () => {
        førsteVedtaksperiode.beregningIder = ['1234', '1236'];
        person.arbeidsgivere[0].vedtaksperioder.push({
            ...førsteVedtaksperiode,
            fom: dayjs('2018-01-03'),
            tom: dayjs('2018-01-04'),
            beregningIder: ['1236'],
        });
        person.arbeidsgivere[0].utbetalingshistorikk = [
            nyttElement(
                '1236',
                dayjs('2018-01-01'),
                dayjs('2018-01-04'),
                dayjs('2018-08-08'),
                vedtaksperiodene,
                false,
                false
            ),
            nyttElement('1235', dayjs('2018-01-01'), dayjs('2018-01-02'), dayjs('2018-08-08'), vedtaksperiodene, true),
            nyttElement('1234', dayjs('2018-01-01'), dayjs('2018-01-02'), dayjs('2018-08-08'), vedtaksperiodene),
        ];

        const { result } = renderHook(() => useTidslinjerader(person, dayjs('2018-01-01'), dayjs('2018-01-04'), false));
        expect(result.current[0].rader.length).toEqual(2);
        expect(result.current[0].rader[0].perioder.length).toEqual(2);
        expect(result.current[0].rader[1].perioder.length).toEqual(1);
        expect(result.current[0].rader[1].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[1].perioder[0].end.isSame(dayjs('2018-01-02'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].start.isSame(dayjs('2018-01-01'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[0].end.isSame(dayjs('2018-01-02'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[1].start.isSame(dayjs('2018-01-03'), 'day')).toBe(true);
        expect(result.current[0].rader[0].perioder[1].end.isSame(dayjs('2018-01-04'), 'day')).toBe(true);
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
