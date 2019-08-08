import 'jest-dom/extend-expect';
import { daysBetween, toDate } from './date';

test('toDate', () => {
    expect(toDate('notadate')).toEqual('Invalid date');
    expect(toDate('12.4.2019')).toEqual('12.04.2019');
    expect(toDate('2019-05-09T00:00:00.000Z')).toEqual('09.05.2019');
});

test('daysBetween', () => {
    expect(daysBetween(toDate('12.4.2019'), toDate('15.4.2019'))).toEqual(3);
    expect(daysBetween(toDate('1.3.2019'), toDate('1.4.2019'))).toEqual(31);
});
