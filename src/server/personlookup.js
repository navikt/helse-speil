'use strict';

const request = require('request');
const authSupport = require('./authsupport');

let navConfig = null;
let cachedAccessToken = null;

const init = config => {
    navConfig = config;
    cachedAccessToken = null;
};

const hentPerson = async aktørId => {
    return new Promise((resolve, reject) => {
        logonToNav()
            .then(jwt => {
                request.get(
                    `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`
                        }
                    },
                    (error, response, body) => {
                        if (error || response.statusCode !== 200) {
                            reject(
                                `Error during person lookup, got ${
                                    response.statusCode
                                } ${error || 'unknown error'}`
                            );
                        } else {
                            resolve(body);
                        }
                    }
                );
            })
            .catch(err => {
                reject(err);
            });
    });
};

const logonToNav = async () => {
    return new Promise((resolve, reject) => {
        if (
            cachedAccessToken &&
            !authSupport.willExpireInLessThan(30, cachedAccessToken)
        ) {
            resolve(cachedAccessToken);
        } else {
            request.get(
                `${navConfig.stsUrl}/rest/v1/sts/token?grant_type=client_credentials&scope=openid`,
                {
                    headers: {
                        Authorization:
                            'Basic ' +
                            Buffer.from(
                                `${navConfig.serviceUserName}:${navConfig.serviceUserPassword}`
                            ).toString('base64')
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
                        cachedAccessToken = body.access_token;
                        resolve(body.access_token);
                    }
                }
            );
        }
    });
};

module.exports = {
    init: init,
    hentPerson: hentPerson
};
