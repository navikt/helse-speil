'use strict';

const request = require('request-promise-native');
const authSupport = require('../auth/authsupport');

let config;

const setup = navConfig => {
    config = navConfig;
    return {
        simulate: simulate,
        isValid: isValid
    };
};

const simulate = async (vedtak, accessToken) => {
    if (!isValid(vedtak)) {
        return Promise.reject(
            `Invalid vedtak supplied. Should have the same structure as '${validVedtak}'`
        );
    }

    vedtak.saksbehandler = authSupport.nameFrom(accessToken);

    const options = {
        uri: config.spennUrl,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: vedtak,
        json: true
    };

    return request.post(options);
};

const isValid = vedtak => {
    return objectStructureEuqals(validVedtak, vedtak);
};

const objectStructureEuqals = (expected, actual) => {
    let eq = true;
    if (Object.keys(expected).length !== Object.keys(actual).length) {
        return false;
    }
    for (const key in expected) {
        if (typeof expected[key] !== typeof actual[key]) {
            return false;
        }

        if (Array.isArray(expected[key])) {
            eq = eq && arrayEquals(expected[key], actual[key]);
        }
    }

    return eq;
};

const arrayEquals = (expected, actual) => {
    for (const key in expected) {
        if (!objectStructureEuqals(expected[key], actual[key])) {
            return false;
        }
    }
    return true;
};

const validVedtak = {
    soknadId: 'abcd123',
    aktorId: '123456',
    vedtaksperioder: [
        {
            fom: '2019-09-27',
            tom: '2019-09-28',
            grad: 100,
            dagsats: 12345,
            fordeling: [
                {
                    mottager: 'orgnr',
                    andel: 100
                }
            ]
        }
    ],
    maksDato: '2019-10-27'
};

module.exports = {
    setup: setup
};
