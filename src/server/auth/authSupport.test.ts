import { cleanup } from '@testing-library/react';
import auth from './authSupport';

type Claim = { [key: string]: string | string[] };

afterEach(cleanup);

test('valid token has expiry in the future', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 10}` });
    expect(auth.isValidNow(token)).toEqual(true);
});

test('invalid token has expiry in the past', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds - 10}` });
    expect(auth.isValidNow(token)).toEqual(false);
});

test('malformed token does not validate', () => {
    expect(auth.isValidNow('bogustext')).toEqual(false);
});

test('willExpireInLessThan is false if test time is before exp', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 30}` });
    expect(auth.willExpireInLessThan(29, token)).toEqual(false);
});

test('willExpireInLessThan is false if test time is at exp', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 30}` });
    expect(auth.willExpireInLessThan(30, token)).toEqual(false);
});

test('willExpireInLessThan is true if test time is after exp', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 30}` });
    expect(auth.willExpireInLessThan(31, token)).toEqual(true);
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
