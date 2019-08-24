'use strict';

const request = require('request');
const authSupport = require('./authsupport');

let cachedAccessToken = null;
let authConfig = null;

const init = navConfig => {
    authConfig = navConfig;
    hentAccessToken();
};

const hentPerson = async aktørId => {
    return new Promise((resolve, reject) => {
        hentAccessToken()
            .then(token => {
                request.get(
                    `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    },
                    (error, response, body) => {
                        if (error || response.statusCode !== 200) {
                            reject(
                                `Error during person lookup, got ${
                                    response?.statusCode
                                } ${error || 'unknown error'}`
                            );
                        } else {
                            resolve(map(JSON.parse(body)));
                        }
                    }
                );
            })
            .catch(err => {
                reject(err);
            });
    });
};

const map = person => {
    return {
        navn: `${person.fornavn} ${person.etternavn}`,
        kjønn: `${person.kjønn}`
    };
};

const hentAccessToken = async () => {
    return new Promise((resolve, reject) => {
        if (tokenNeedsRefresh()) {
            request.get(
                `${authConfig.stsUrl}/rest/v1/sts/token?grant_type=client_credentials&scope=openid`,
                {
                    headers: {
                        Authorization:
                            'Basic ' +
                            Buffer.from(
                                `${authConfig.serviceUserName}:${authConfig.serviceUserPassword}`
                            ).toString('base64'),
                        Accept: 'application/json'
                    }
                },
                (error, response, body) => {
                    if (error || response.statusCode !== 200) {
                        reject(
                            `Error during STS login, got ${response?.statusCode ||
                                'unknown status code'}: ${error ||
                                'unknown error'}`
                        );
                    } else {
                        try {
                            cachedAccessToken = JSON.parse(body).access_token;
                            resolve(cachedAccessToken);
                        } catch (err) {
                            reject('Error while parsing response from sts');
                        }
                    }
                }
            );
        } else {
            resolve(cachedAccessToken);
        }
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
