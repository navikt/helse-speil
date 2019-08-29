'use strict';

const { ipAddressFromRequest } = require('./requestData');

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
        console.log(`error while checking token validity: ${err}`);
        return false;
    }
};

const willExpireInLessThan = (seconds, token) => {
    const timeToTest = Math.floor(Date.now() / 1000) + seconds;
    const expirationTime = parseInt(claimsFrom(token)['exp']);
    return timeToTest > expirationTime;
};

const validateOidcCallback = (req, azureClient, config) => {
    const params = azureClient.callbackParams(req);
    const nonce = req.session.nonce;

    return new Promise((resolve, reject) => {
        azureClient
            .callback(config.redirectUrl, params, { nonce })
            .then(tokenSet => {
                const accessToken = tokenSet['access_token'];
                const idToken = tokenSet['id_token'];
                const requiredGroup = config.requiredGroup;
                const username = nameFrom(idToken);
                if (accessToken && isMemberOf(requiredGroup, accessToken)) {
                    console.log(
                        `User ${username} has been authenticated, from IP address ${ipAddressFromRequest(
                            req
                        )}`
                    );
                    resolve([accessToken, idToken]);
                } else {
                    reject(
                        `'${username}' is not member of '${requiredGroup}', denying access`
                    );
                }
            })
            .catch(err => {
                reject(`error in oidc callback: ${err}`);
            });
    });
};

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
        return (
            JSON.parse(Buffer.from(token.split('.')[1], 'base64'))['name'] ||
            'unknown user'
        );
    } catch (err) {
        console.log(`error while extracting name: ${err}`);
        return 'unknown user';
    }
};

module.exports = {
    isValidAt: isValidAt,
    isValidNow: isValidNow,
    willExpireInLessThan: willExpireInLessThan,
    validateOidcCallback: validateOidcCallback,
    isMemberOf: isMemberOf,
    nameFrom: nameFrom
};
