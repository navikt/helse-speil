import 'jest-dom/extend-expect';
import { daysBetween, toDate } from '../../src/utils/date';

test('toDate', () => {
    expect(toDate('notadate')).toEqual('Invalid Date');
    expect(toDate('12.4.2019')).toEqual('12/4/2019');
    expect(toDate('2019-05-09T00:00:00.000Z')).toEqual('5/9/2019');
});

test('daysBetween', () => {
    expect(daysBetween(toDate('4.12.2019'), toDate('4.15.2019'))).toEqual(3);
    expect(daysBetween(toDate('3.1.2019'), toDate('4.1.2019'))).toEqual(31);
});
