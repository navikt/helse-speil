'use strict';

const stsclient = require('./stsclient');

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
    stsclient.init({
        stsUrl: 'http://localhost',
        ...validCreds
    });

    await expect(stsclient.hentAccessToken()).resolves.toMatch('bogussignature');
});

test('invalid credentials rejects with error message', async () => {
    stsclient.init({
        stsUrl: 'http://localhost',
        ...bogusCreds
    });

    await expect(stsclient.hentAccessToken()).rejects.toMatch('wrong creds');
});
