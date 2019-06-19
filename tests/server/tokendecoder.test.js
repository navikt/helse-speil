import { cleanup } from 'react-testing-library';

const tokendecoder = require('../../src/server/tokendecoder');

afterEach(cleanup);

test('nameExtractionFromValidToken', async () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
    const token = `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(payload)
    )}.signaturehere`;
    const name = tokendecoder.username(token);
    expect(name).toEqual('John Doe');
});

test('nameExtractionFromInvalidToken', async () => {
    const name = tokendecoder.username('bogusstuffhere');
    expect(name).toEqual('unknown user');
});
