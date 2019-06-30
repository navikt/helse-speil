'use strict';

const request = require('request');

const behandlingerFor = (aktorId, accessToken, callback) => {
    request.get(
        `http://spade.default.svc.nais.local/api/behandlinger/${aktorId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        },
        (error, response, body) => {
            const erred = error || response.statusCode !== 200;
            if (erred) {
                console.log(
                    `Error during lookup, got ${response.statusCode} ${error ||
                        'unknown error'} fom spade`
                );
            }

            callback({
                status: response.statusCode,
                data: erred ? error : body
            });
        }
    );
};

module.exports = {
    behandlingerFor: behandlingerFor
};
