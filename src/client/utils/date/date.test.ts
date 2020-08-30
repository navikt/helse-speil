import '@testing-library/jest-dom/extend-expect';
import { arbeidsdagerMellom, daysBetween, findLatest } from './index';
import { somDato } from '../../context/mapping/vedtaksperiode';

test('daysBetween', () => {
    expect(daysBetween(somDato('2019-04-12'), somDato('2019-04-15'))).toEqual(3);
    expect(daysBetween(somDato('2019-03-01'), somDato('2019-04-01'))).toEqual(31);
});

test('findLatest', () => {
    const dates = [somDato('2018-01-31'), somDato('2018-02-26'), somDato('2018-02-27'), somDato('2017-01-31')];
    expect(findLatest(dates)).toEqual(somDato('2018-02-27'));
});

test('listOfWorkdaysBetween', () => {
    const first = somDato('2018-01-03');
    const last = somDato('2018-01-08');
    expect(arbeidsdagerMellom(first, last)).toEqual([
        somDato('2018-01-03'),
        somDato('2018-01-04'),
        somDato('2018-01-05'),
        somDato('2018-01-08'),
    ]);
});
