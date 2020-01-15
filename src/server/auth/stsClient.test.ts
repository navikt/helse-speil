// @ts-nocheck
import stsClient from './stsClient';

global.console = {
    error: jest.fn()
};

const validCreds = {
    serviceUserName: 'valid',
    serviceUserPassword: 'creds'
};

const bogusCreds = {
    serviceUserName: 'bogus',
    serviceUserPassword: 'creds'
};

test('valid credentials resolves with valid token', async () => {
    stsClient.init({
        stsUrl: 'http://localhost',
        ...validCreds
    });

    await expect(stsClient.hentAccessToken()).resolves.toMatch('bogussignature');
});

test('invalid credentials rejects with error message', async () => {
    stsClient.init({
        stsUrl: 'http://localhost',
        ...bogusCreds
    });

    await expect(stsClient.hentAccessToken()).rejects.toMatch('wrong creds');
});
