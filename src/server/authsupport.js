'use strict';

const username = token => {
    try {
        return JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        )['name'];
    } catch (err) {
        console.log(`error while extracting name from token: ${err}`);
        return 'unknown user';
    }
};

const stillValid = token => {
    try {
        const claims = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );
        const expirationTime = parseInt(claims['exp']);
        const nowInSeconds = Math.floor(Date.now() / 1000);
        return expirationTime >= nowInSeconds;
    } catch (err) {
        console.log(`error while checking token validity: ${err}`);
        return false;
    }
};

module.exports = {
    username: username,
    stillValid: stillValid
};
