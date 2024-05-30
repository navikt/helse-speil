import { extractSpeilToken } from './cookie';

test('henter ut speiltoken fra cookie', () => {
    const token = 'adjqbwdihqjwndøqnwldhjkvqwojhdbqwpidhbuqtwvx';
    document.cookie = `speil=${token}`;
    expect(extractSpeilToken()).toEqual(token);
});
