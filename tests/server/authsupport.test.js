import { cleanup } from 'react-testing-library';

const authsupport = require('../../src/server/authsupport');

afterEach(cleanup);

const clgOrig = console.log;

beforeAll(() => {
    // make less noise in the log
    console.log = jest.fn();
});

afterAll(() => {
    console.log = clgOrig;
});

test('name extraction from valid token', async () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
    const token = `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(payload)
    )}.signaturehere`;
    const name = authsupport.username(token);
    expect(name).toEqual('John Doe');
});

test('name extraction from invalid token', async () => {
    const name = authsupport.username('bogusstuffhere');
    expect(name).toEqual('unknown user');
});

test('valid token has expiry in the future', async () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { exp: `${nowInSeconds + 10}` };
    const token = `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(payload)
    )}.signaturehere`;
    expect(authsupport.stillValid(token)).toEqual(true);
});

test('invalid token has expiry in the past', async () => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { exp: `${nowInSeconds - 10}` };
    const token = `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(payload)
    )}.signaturehere`;
    expect(authsupport.stillValid(token)).toEqual(false);
});

test('missing token does not validate', async () => {
    expect(authsupport.stillValid(null)).toEqual(false);
});

test('malformed token does not validate', async () => {
    expect(authsupport.stillValid('bogustext')).toEqual(false);
});
