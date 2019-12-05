const request = require('request-promise-native');

const behandlingerForPeriode = (fom, tom, accessToken) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/behov/periode?fom=${fom}&tom=${tom}`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        json: true,
        resolveWithFullResponse: true
    };
    return request.get(options);
};

module.exports = {
    behandlingerForPeriode
};
