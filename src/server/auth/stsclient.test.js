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

test('valid credentials resolves with valid token', () => {
    stsclient.init({
        stsUrl: 'http://localhost',
        ...validCreds
    });

    expect(stsclient.hentAccessToken()).resolves.toMatch('bogussignature');
});

test('invalid credentials rejects with error message', () => {
    stsclient.init({
        stsUrl: 'http://localhost',
        ...bogusCreds
    });

    expect(stsclient.hentAccessToken()).rejects.toMatch('wrong creds');
});
