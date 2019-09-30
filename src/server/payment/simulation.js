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
        return Promise.reject(`Invalid vedtak supplied. Should look like '${validVedtak}'`);
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
    const requiredKeys = Object.keys(validVedtak);
    const actualKeys = Object.keys(vedtak);
    return (
        actualKeys.length == requiredKeys.length &&
        requiredKeys.reduce((acc = true, current) => acc && actualKeys.includes(current))
    );
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
            fordeling: [{ mottager: 'orgnr', andel: 100 }]
        }
    ],
    maksDato: 2019 - 10 - 27
};

module.exports = {
    setup: setup
};
