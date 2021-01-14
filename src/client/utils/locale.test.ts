import { capitalize, capitalizeName, extractNameFromEmail, somPenger, toKronerOgØre } from './locale';

test('somPenger', () => {
    expect(somPenger(1000000)).toEqual('1 000 000,00 kr');
    expect(somPenger(100000)).toEqual('100 000,00 kr');
    expect(somPenger(10000)).toEqual('10 000,00 kr');
    expect(somPenger(1000)).toEqual('1 000,00 kr');
    expect(somPenger(100)).toEqual('100,00 kr');
    expect(somPenger(10)).toEqual('10,00 kr');
    expect(somPenger(1)).toEqual('1,00 kr');
    expect(somPenger(0.99)).toEqual('0,99 kr');

    expect(somPenger(undefined)).toEqual('-');
});

test('toKronerOgØre', () => {
    expect(toKronerOgØre(1000000)).toEqual('1 000 000,00');
    expect(toKronerOgØre(100000)).toEqual('100 000,00');
    expect(toKronerOgØre(10000)).toEqual('10 000,00');
    expect(toKronerOgØre(1000)).toEqual('1 000,00');
    expect(toKronerOgØre(100)).toEqual('100,00');
    expect(toKronerOgØre(10)).toEqual('10,00');
    expect(toKronerOgØre(1)).toEqual('1,00');
    expect(toKronerOgØre(0.99)).toEqual('0,99');
});

test('capitalize', () => {
    expect(capitalize('meh')).toEqual('Meh');
    expect(capitalize('')).toEqual('');
});

test('capitalizeName', () => {
    expect(capitalizeName('ole dole doffen')).toEqual('Ole Dole Doffen');
    expect(capitalizeName('')).toEqual('');
});

test('extractNameFromEmail', () => {
    expect(extractNameFromEmail('test.test@abc.no')).toEqual('test test');
});
