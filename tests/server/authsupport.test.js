import { cleanup } from 'react-testing-library';

const authsupport = require('../../src/server/authsupport');

const clgOrig = console.log;

afterEach(cleanup);

afterEach(cleanup);

beforeAll(() => {
    // reduce noise in log
    console.log = jest.fn();
});

afterAll(() => {
    console.log = clgOrig;
});

test('valid token has expiry in the future', async () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds + 10}` });
    expect(authsupport.stillValid(token)).toEqual(true);
});

test('invalid token has expiry in the past', async () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const token = createToken({ exp: `${nowInSeconds - 10}` });
    expect(authsupport.stillValid(token)).toEqual(false);
});

test('null token does not validate', async () => {
    expect(authsupport.stillValid(null)).toEqual(false);
});

test('undefined token does not validate', async () => {
    expect(authsupport.stillValid(undefined)).toEqual(false);
});

test('malformed token does not validate', async () => {
    expect(authsupport.stillValid('bogustext')).toEqual(false);
});

test('user is member of required group', async () => {
    const token = createToken({ groups: ['group1', 'group2', 'group3'] });
    expect(authsupport.isMemberOf('group3', token)).toEqual(true);
});

test('user is not member of required group', async () => {
    const token = createToken({ groups: ['group1', 'group2', 'group3'] });
    expect(authsupport.isMemberOf('group4', token)).toEqual(false);
});

test('name extraction from jwt', async () => {
    const token = createToken({ name: 'John Doe' });
    expect(authsupport.nameFrom(token)).toEqual('John Doe');
});

test('name extraction from jwt, name property missing', async () => {
    const token = createToken({});
    expect(authsupport.nameFrom(token)).toEqual('unknown user');
});

test('name extraction from jwt, malformed token', async () => {
    const token = 'invalid bogus';
    expect(authsupport.nameFrom(token)).toEqual('unknown user');
});

const createToken = claims => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(claims)
    )}.bogussignature`;
};
