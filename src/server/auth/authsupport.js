'use strict';

const logger = require('../logging');

const { ipAddressFromRequest } = require('../requestData');

const isValidNow = token => {
    return isValidAt(token, Math.floor(Date.now()) / 1000);
};

const isValidAt = (token, timeInSeconds) => {
    if (!token) {
        return false;
    }

    try {
        const claims = claimsFrom(token);
        const expirationTime = parseInt(claims['exp']);
        return expirationTime >= timeInSeconds;
    } catch (err) {
        logger.error(`error while checking token validity: ${err}`);
        return false;
    }
};

const willExpireInLessThan = (seconds, token) => {
    const timeToTest = Math.floor(Date.now() / 1000) + seconds;
    const expirationTime = parseInt(claimsFrom(token)['exp']);
    return timeToTest > expirationTime;
};

const validateOidcCallback = (req, azureClient, config) => {
    if (req.body.code === undefined) {
        return Promise.reject('missing data in POST after login');
    }
    const params = azureClient.callbackParams(req);
    const nonce = req.session.nonce;
    const state = req.session.state;

    return new Promise((resolve, reject) => {
        azureClient
            .callback(config.redirectUrl, params, { nonce, state })
            .then(tokenSet => {
                const accessTokenKey = 'access_token';
                const idTokenKey = 'id_token';
                const errorMessages = checkAzureResponseContainsTokens(
                    tokenSet,
                    accessTokenKey,
                    idTokenKey
                );
                if (errorMessages.length > 0) {
                    return reject(`Access denied: ${errorMessages.join(' ')}`);
                }

                const accessToken = tokenSet[accessTokenKey];
                const idToken = tokenSet[idTokenKey];
                const requiredGroup = config.requiredGroup;
                const username = nameFrom(idToken);
                if (accessToken && isMemberOf(requiredGroup, accessToken)) {
                    logger.info(
                        `User ${username} has been authenticated, from IP address ${ipAddressFromRequest(
                            req
                        )}`
                    );
                    resolve([accessToken, idToken]);
                } else {
                    reject(`'${username}' is not member of '${requiredGroup}', denying access`);
                }
            })
            .catch(err => {
                reject(`error in oidc callback: ${err}`);
            });
    });
};

const checkAzureResponseContainsTokens = (tokenSet, ...tokens) =>
    [...tokens]
        .filter(tokenName => tokenSet[tokenName] === undefined)
        .map(tokenName => `Missing ${[tokenName]} in response from Azure AD.`);

const isMemberOf = (group, token) => {
    const claims = claimsFrom(token);
    const groups = claims['groups'];
    return groups.filter(element => element === group).length === 1;
};

const claimsFrom = token => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

const nameFrom = token => {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64'))['name'] || 'unknown user';
    } catch (err) {
        logger.error(`error while extracting name: ${err}`);
        return 'unknown user';
    }
};

const createTokenForTest = () =>
    `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
        JSON.stringify({ name: 'S. A. Ksbehandler', email: 'dev@nav.no', NAVident: 'dev-ident' })
    ).toString('base64')}.bogussignature`;

module.exports = {
    isValidAt,
    isValidNow,
    willExpireInLessThan,
    validateOidcCallback,
    isMemberOf,
    nameFrom,
    createTokenForTest
};
