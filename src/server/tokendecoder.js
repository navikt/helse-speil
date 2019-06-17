'use strict';

module.exports.username = token => {
    try {
        return JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        )['name'];
    } catch (err) {
        console.log(`error while extracting name from token: ${err}`);
        return 'unknown user';
    }
};
