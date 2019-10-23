'use strict';

const request = require('request-promise-native');
const fs = require('fs');

const logger = require('../logging');
const mapping = require('./mapping');
const aktøridlookup = require('../aktørid/aktøridlookup');
const { isValidSsn } = require('../aktørid/ssnvalidation');
const { nameFrom } = require('../auth/authsupport');

const personIdHeaderName = 'nav-person-id';

const setup = ({ stsclient, config }) => {
    aktøridlookup.init(stsclient, config);
};

const personSøk = async (req, res) => {
    const undeterminedPersonId = req.headers[personIdHeaderName];
    auditLog(req, undeterminedPersonId || 'missing person id');
    if (!undeterminedPersonId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    let aktorId = isValidSsn(undeterminedPersonId)
        ? await toAktørId(undeterminedPersonId)
        : undeterminedPersonId;
    if (!aktorId) {
        res.status(404).send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
        return;
    }

    respondWith(res, _personSøk(aktorId, req.session.spadeToken), mapping.person);
};

const behandlingerForPeriod = (req, res) => {
    auditLog(req, fom || 'missing fom', tom || 'missing tom');

    const fom = 'fom';
    const tom = 'tom';

    respondForSummary(
        res,
        _behandlingerForPeriod(fom, tom, req.session.spadeToken),
        mapping.fromBehandlingSummary
    );
};

const auditLog = (request, ...queryParams) => {
    const speilUser = nameFrom(request.session.spadeToken);
    logger.audit(
        `${speilUser} is doing lookup with params: ${queryParams.reduce(
            (previous, current) => `${previous}, ${current}`
        )}`
    );
};

const toAktørId = async fnr => {
    return await aktøridlookup.hentAktørId(fnr).catch(err => {
        logger.error(`Could not fetch aktørId. ${err}`);
    });
};

const _personSøk = (aktorId, accessToken) => {
    return process.env.NODE_ENV === 'development'
        ? devBehandlingerForPerson(aktorId)
        : prodBehandlingerForPerson(aktorId, accessToken);
};

const _behandlingerForPeriod = (fom, tom, accessToken) => {
    return process.env.NODE_ENV === 'development'
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
    const fromFile = fs.readFileSync('__mock-data__/tidslinjeperson.json', 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve({
        statusCode: 200,
        body: {
            fnr: aktorId,
            person
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

const respondWith = (res, lookupPromise, mapper) => {
    lookupPromise
        .then(apiResponse => {
            res.status(apiResponse.statusCode).send({
                person: mapper(apiResponse.body.person)
            });
        })
        .catch(err => {
            logger.error(`Error during behandlinger lookup: ${err}`);
            res.sendStatus(500);
        });
};

const respondForSummary = (res, lookupPromise, mapper) => {
    lookupPromise
        .then(apiResponse => {
            res.status(apiResponse.statusCode).send({
                behandlinger: apiResponse.body.behandlinger.map(mapper)
            });
        })
        .catch(err => {
            logger.error(`Error during behandlinger lookup: ${err}`);
            res.sendStatus(500);
        });
};

module.exports = {
    setup,
    personSøk,
    behandlingerForPeriod,
    _personSøk,
    _behandlingerForPeriod
};
