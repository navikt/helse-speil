import 'jest-dom/extend-expect';
import { capitalize, toMonetaryValue } from '../../src/utils/locale';

test('capitalize', () => {
    expect(capitalize('abCDef')).toEqual('Abcdef');
    expect(capitalize('123abcDEF')).toEqual('123abcdef');
    expect(capitalize('ABCDEF')).toEqual('Abcdef');
});

test('toMonetaryValue', () => {
    expect(toMonetaryValue(93812)).toEqual('93,812.00');
    expect(toMonetaryValue(0)).toEqual('0.00');
    expect(toMonetaryValue(-123)).toEqual('-123.00');
});
