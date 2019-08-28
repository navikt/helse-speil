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
    return new Promise((resolve, reject) => {
        hentAccessToken()
            .then(token => {
                const options = {
                    uri: `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    json: true
                };

                request
                    .get(options)
                    .then(person => {
                        resolve(map(person));
                    })
                    .catch(err => {
                        reject(`Error while finding person: ${err}`);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });
};

const hentAccessToken = async () => {
    return new Promise((resolve, reject) => {
        if (tokenNeedsRefresh()) {
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

            request
                .get(options)
                .then(response => {
                    cachedAccessToken = response.access_token;
                    resolve(cachedAccessToken);
                })
                .catch(err => {
                    reject(`Error while retrieving access token: ${err}`);
                });
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

const map = person => {
    return {
        navn: `${person.fornavn} ${person.etternavn}`,
        kjønn: `${person.kjønn}`
    };
};

module.exports = {
    init: init,
    hentPerson: hentPerson
};
