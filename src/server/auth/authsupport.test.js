import { cleanup } from '@testing-library/react';

const authsupport = require('./authsupport');

afterEach(cleanup);

test('valid token has expiry in the future', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 10}` });
    expect(authsupport.isValidNow(token)).toEqual(true);
});

test('invalid token has expiry in the past', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds - 10}` });
    expect(authsupport.isValidNow(token)).toEqual(false);
});

test('null token does not validate', () => {
    expect(authsupport.isValidNow(null)).toEqual(false);
});

test('undefined token does not validate', () => {
    expect(authsupport.isValidNow(undefined)).toEqual(false);
});

test('malformed token does not validate', () => {
    expect(authsupport.isValidNow('bogustext')).toEqual(false);
});

test('willExpireInLessThan is false if test time is before exp', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 30}` });
    expect(authsupport.willExpireInLessThan(29, token)).toEqual(false);
});

test('willExpireInLessThan is false if test time is at exp', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 30}` });
    expect(authsupport.willExpireInLessThan(30, token)).toEqual(false);
});

test('willExpireInLessThan is true if test time is after exp', () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 30}` });
    expect(authsupport.willExpireInLessThan(31, token)).toEqual(true);
});

test('user is member of required group', () => {
    const token = createToken({ groups: ['group1', 'group2', 'group3'] });
    expect(authsupport.isMemberOf('group3', token)).toEqual(true);
});

test('user is not member of required group', () => {
    const token = createToken({ groups: ['group1', 'group2', 'group3'] });
    expect(authsupport.isMemberOf('group4', token)).toEqual(false);
});

test('name extraction from jwt', () => {
    const token = createToken({ name: 'John Doe' });
    expect(authsupport.nameFrom(token)).toEqual('John Doe');
});

test('name extraction from jwt, name property missing', () => {
    const token = createToken({});
    expect(authsupport.nameFrom(token)).toEqual('unknown user');
});

test('name extraction from jwt, malformed token', () => {
    const token = 'invalid bogus';
    expect(authsupport.nameFrom(token)).toEqual('unknown user');
});

test('navIdent extraction from jwt', () => {
    const token = createToken({ name: 'John Doe', NAVident: 'X12345' });
    expect(authsupport.navIdentFrom(token)).toEqual('X12345');
});

const createToken = claims => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(claims))}.bogussignature`;
};
