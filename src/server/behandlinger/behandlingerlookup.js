'use strict';

const request = require('request-promise-native');
const fs = require('fs');

const behandlingerForPerson = (aktorId, accessToken) => {
    const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    return mode === 'dev'
        ? devBehandlingerForPerson(aktorId)
        : prodBehandlingerForPerson(aktorId, accessToken);
};

const behandlingerForPeriod = (fom, tom, accessToken) => {
    const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    return mode === 'dev'
        ? devBehandlingerForPeriod()
        : prodBehandlingerForPeriod(fom, tom, accessToken);
};

const prodBehandlingerForPerson = (aktorId, accessToken) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/behandlinger/${aktorId}`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        json: true,
        resolveWithFullResponse: true
    };
    return request.get(options);
};

const devBehandlingerForPerson = aktorId => {
    const fromFile = fs.readFileSync('__mock-data__/behandlinger.json', 'utf-8');
    const behandlinger = JSON.parse(fromFile).behandlinger;
    return Promise.resolve({
        statusCode: 200,
        body: {
            fnr: aktorId,
            behandlinger: behandlinger
        }
    });
};

const prodBehandlingerForPeriod = (fom, tom, accessToken) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/behandlinger/periode/${fom}/${tom}`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        json: true,
        resolveWithFullResponse: true
    };
    return request.get(options);
};

const devBehandlingerForPeriod = () => {
    const fromFile = fs.readFileSync('__mock-data__/behandlingsummaries.json', 'utf-8');
    const summary = JSON.parse(fromFile).behandlinger;
    return Promise.resolve({
        statusCode: 200,
        body: { behandlinger: summary }
    });
};

module.exports = {
    behandlingerForPerson: behandlingerForPerson,
    behandlingerForPeriod: behandlingerForPeriod
};
