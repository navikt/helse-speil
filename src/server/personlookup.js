'use strict';

const request = require('request-promise-native');
const authSupport = require('./authsupport');

let cachedAccessToken = null;
let authConfig = null;

const init = navConfig => {
    authConfig = navConfig;
    hentAccessToken().catch(err => {
        console.error(`Error during login: ${err}`);
    });
};

const hentPerson = async aktørId => {
    return hentAccessToken().then(token => {
        const options = {
            uri: `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        };

        return request.get(options);
    });
};

const hentAccessToken = async () => {
    if (!tokenNeedsRefresh()) {
        return Promise.resolve(cachedAccessToken);
    }

    const options = {
        uri: `${authConfig.stsUrl}/rest/v1/sts/token?grant_type=client_credentials&scope=openid`,
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(
                    `${authConfig.serviceUserName}:${authConfig.serviceUserPassword}`
                ).toString('base64')
        },
        json: true
    };

    return request.get(options).then(response => {
        cachedAccessToken = response.access_token;
        return Promise.resolve(cachedAccessToken);
    });
};

const tokenNeedsRefresh = () => {
    return (
        !cachedAccessToken ||
        authSupport.willExpireInLessThan(30, cachedAccessToken)
    );
};

module.exports = {
    init: init,
    hentPerson: hentPerson
};
