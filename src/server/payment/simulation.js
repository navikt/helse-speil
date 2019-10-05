'use strict';

const request = require('request-promise-native');
const authSupport = require('../auth/authsupport');

let config;

const setup = navConfig => {
    config = navConfig;
    return {
        simulate: simulate
    };
};

const simulate = async (vedtak, accessToken) => {
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

module.exports = {
    setup: setup
};
