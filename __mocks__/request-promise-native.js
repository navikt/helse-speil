'use strict';

const rpn = jest.genMockFromModule('request-promise-native');

const testPerson = {
    fdato: '1995-01-01',
    statsborgerskap: 'NOR',
    etternavn: 'BETJENT',
    aktørId: '1000012345678',
    bostedsland: 'NOR',
    fornavn: 'BJARNE',
    kjønn: 'MANN',
    status: 'BOSA'
};

rpn.get = options =>
    new Promise((resolve, reject) => {
        if (options.uri.includes('/sts/')) {
            if (options.headers.Authorization.includes('Ym9ndXM6Y3JlZHM=')) {
                reject('wrong creds');
            } else {
                resolve({ access_token: createToken({ exp: 12345 }) });
            }
        } else {
            if (options.uri.includes('11111')) {
                resolve(testPerson);
            } else {
                reject('request failed');
            }
        }
    });

const createToken = claims => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(
        JSON.stringify(claims)
    )}.bogussignature`;
};

module.exports = rpn;
