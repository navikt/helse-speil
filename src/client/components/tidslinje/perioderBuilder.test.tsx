import { PerioderBuilder, PerioderTilstand } from './perioderBuilder';
import dayjs, { Dayjs } from 'dayjs';
import { Dagtype, Sykdomsdag } from 'internal-types';
import { Tidslinjeperiode, Utbetalingstatus } from '../../modell/UtbetalingshistorikkElement';

describe('useRevurderingsrader', () => {
    test('kan utvide periode', () => {
        const periode = Tidslinjeperiode.nyRevurderingsperiode('', dayjs('2018-01-01'), Utbetalingstatus.UTBETALT);
        periode.extend(dayjs('2018-01-31'));
        expect(periode.tom).toEqual(dayjs('2018-01-31'));
    });

    test('builder add legger til periode i perioder-objektet', () => {
        const builder = new PerioderBuilder('id', Utbetalingstatus.UTBETALT);
        builder.add(Tidslinjeperiode.nyRevurderingsperiode('', dayjs('2018-01-01'), Utbetalingstatus.UTBETALT));
        expect(builder.perioder.length).toEqual(1);
    });

    test('Kan bytte tilstand', () => {
        const builder = new PerioderBuilder('id', Utbetalingstatus.UTBETALT);
        builder.byttTilstand(new TestState(), dayjs('2018-01-01'));
        expect(builder.tilstand).toBeInstanceOf(TestState);
    });

    test('Tom tidslinje', () => {
        const tidslinje: Sykdomsdag[] = [];

        const builder = new PerioderBuilder('id', Utbetalingstatus.UTBETALT);
        builder.build(tidslinje);
        expect(builder.perioder.length).toEqual(0);
    });

    test('Kan konvertere sykedag til periode', () => {
        const tidslinje = [
            {
                dato: dayjs('2018-01-01'),
                type: Dagtype.Syk,
            },
        ];

        const builder = new PerioderBuilder('id', Utbetalingstatus.UTBETALT);
        builder.build(tidslinje);
        expect(builder.perioder.length).toEqual(1);
    });

    test('Konverterer ikke ubestemt dag til periode', () => {
        const tidslinje = [
            {
                dato: dayjs('2018-01-01'),
                type: Dagtype.Syk,
            },
            {
                dato: dayjs('2018-01-02'),
                type: Dagtype.Ubestemt,
            },
        ];

        const builder = new PerioderBuilder('id', Utbetalingstatus.UTBETALT);
        builder.build(tidslinje);
        expect(builder.perioder.length).toEqual(1);
    });

    test('Sykedag på hver side av en ubestemt dag medfører to perioder', () => {
        const tidslinje = [
            {
                dato: dayjs('2018-01-01'),
                type: Dagtype.Syk,
            },
            {
                dato: dayjs('2018-01-02'),
                type: Dagtype.Ubestemt,
            },
            {
                dato: dayjs('2018-01-03'),
                type: Dagtype.Syk,
            },
        ];

        const builder = new PerioderBuilder('id', Utbetalingstatus.UTBETALT);
        builder.build(tidslinje);
        expect(builder.perioder.length).toEqual(2);
    });

    test('Ikke ny periode ved ukjent dagtype', () => {
        const tidslinje = [
            {
                dato: dayjs('2018-01-01'),
                type: Dagtype.Syk,
            },
            {
                dato: dayjs('2018-01-02'),
                type: Dagtype.Ubestemt,
            },
            {
                dato: dayjs('2018-01-03'),
                type: Dagtype.Annullert,
            },
            {
                dato: dayjs('2018-01-04'),
                type: Dagtype.Syk,
            },
        ];

        const builder = new PerioderBuilder('id', Utbetalingstatus.UTBETALT);
        builder.build(tidslinje);
        expect(builder.perioder.length).toEqual(2);
    });
});

class TestState implements PerioderTilstand {
    entering = (builder: PerioderBuilder, dagen: Dayjs): void => {};
    leaving = (builder: PerioderBuilder, dagen: Dayjs): void => {};
    sykedag = (builder: PerioderBuilder, dagen: Dayjs): void => {};
    ukjentDag = (builder: PerioderBuilder, dagen: Dayjs): void => {};
    vedtaksperiodeDag = (builder: PerioderBuilder, dagen: Dayjs): void => {};
}
