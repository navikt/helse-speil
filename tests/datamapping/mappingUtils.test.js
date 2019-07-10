import { toDate, capitalize } from '../../src/datamapping/mappingUtils';
import 'jest-dom/extend-expect';

test('toDate', () => {
    expect(toDate('notadate')).toEqual('Invalid Date');
    expect(toDate('12.4.2019')).toEqual('4.12.2019');
    expect(toDate('2019-05-09T00:00:00.000Z')).toEqual('9.5.2019');
});

test('capitalize', () => {
    expect(capitalize('abCDef')).toEqual('Abcdef');
    expect(capitalize('123abcDEF')).toEqual('123abcdef');
    expect(capitalize('ABCDEF')).toEqual('Abcdef');
});
