'use strict';

const stillValid = token => {
    try {
        const claims = claimsFrom(token);
        const expirationTime = parseInt(claims['exp']);
        const nowInSeconds = Math.floor(Date.now() / 1000);
        return expirationTime >= nowInSeconds;
    } catch (err) {
        console.log(`error while checking token validity: ${err}`);
        return false;
    }
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
    stillValid: stillValid,
    isMemberOf: isMemberOf,
    nameFrom: nameFrom
};
