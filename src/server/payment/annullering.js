'use strict';

const request = require('request-promise-native');
const authSupport = require('../auth/authsupport');

let config;

const setup = navConfig => {
    config = navConfig;
    return {
        annullering: annullering
    };
};

const annullering = async (body, accessToken) => {
    body.saksbehandler = authSupport.valueFromClaim('NAVident', accessToken);

    const options = {
        uri: `${config.spennUrl}/api/v1/opphor`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: body,
        json: true
    };

    return request.post(options);
};

module.exports = {
    setup: setup
};
