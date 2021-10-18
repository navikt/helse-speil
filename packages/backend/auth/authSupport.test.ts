import { cleanup } from '@testing-library/react';

import auth from './authSupport';

type Claim = { [key: string]: string | string[] };

afterEach(cleanup);

describe('isValidIn', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const tokenThatExpiresIn = (seconds: number) => createToken({ exp: `${nowInSeconds + seconds}` });

    test('time to check is before exp', () => {
        expect(auth.isValidIn({ seconds: 28, token: tokenThatExpiresIn(30) })).toEqual(true);
    });

    test('time to check is at exp', () => {
        expect(auth.isValidIn({ seconds: 30, token: tokenThatExpiresIn(30) })).toEqual(false);
    });

    test('time to check is after exp', () => {
        expect(auth.isValidIn({ seconds: 31, token: tokenThatExpiresIn(30) })).toEqual(false);
    });

    test('the exp has already passed', () => {
        expect(auth.isValidIn({ seconds: 1, token: tokenThatExpiresIn(-30) })).toEqual(false);
    });

    test('there is no token', () => {
        expect(auth.isValidIn({ seconds: 1, token: undefined })).toEqual(false);
    });
});

test('user is member of required group', () => {
    const token = createToken({ groups: ['group1', 'group2', 'group3'] });
    expect(auth.isMemberOf(token, 'group3')).toEqual(true);
});

test('user is not member of required group', () => {
    const token = createToken({ groups: ['group1', 'group2', 'group3'] });
    expect(auth.isMemberOf(token, 'group4')).toEqual(false);
});

test('extraction from named jwt claim', () => {
    const token = createToken({ name: 'John Doe' });
    expect(auth.valueFromClaim('name', token)).toEqual('John Doe');
});

test('extraction from jwt claim, property missing', () => {
    const token = createToken({});
    expect(auth.valueFromClaim('name', token)).toEqual('unknown value');
});

test('extraction from jwt claim, malformed token', () => {
    const token = 'invalid bogus';
    expect(auth.valueFromClaim('name', token)).toEqual('unknown value');
});

const createToken = (claims: Claim) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(claims))}.bogussignature`;
};
