import { capitalize, capitalizeName, extractNameFromEmail, somPenger, toKronerOgØre } from './locale';

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
