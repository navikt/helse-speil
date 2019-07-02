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
