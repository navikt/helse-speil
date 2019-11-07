'use strict';

const moment = require('moment');

const logger = require('../logging');
const mapping = require('./mapping');
const { isValidSsn } = require('../aktørid/ssnvalidation');
const { valueFromClaim } = require('../auth/authsupport');

const personIdHeaderName = 'nav-person-id';

let aktørIdLookup;
let spadeClient;

const setup = ({ aktørIdLookup: aktøridlookup, spadeClient: spadeclient }) => {
    aktørIdLookup = aktøridlookup;
    spadeClient = spadeclient;
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

    respondWith(res, _personSøk(aktorId, req.session.spadeToken), input => input);
};

const behandlingerForPeriod = (req, res) => {
    auditLog(req);

    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

    respondForSummary(
        res,
        _behandlingerForPeriod(yesterday, today, req.session.spadeToken),
        mapping.fromBehandlingSummary
    );
};

const auditLog = (request, ...queryParams) => {
    const speilUser = valueFromClaim('name', request.session.spadeToken);
    logger.audit(
        `${speilUser} is doing lookup with params: ${queryParams?.reduce(
            (previous, current) => `${previous}, ${current}`,
            ''
        )}`
    );
};

const toAktørId = async fnr => {
    return await aktørIdLookup.hentAktørId(fnr).catch(err => {
        logger.error(`Could not fetch aktørId. ${err}`);
    });
};

const _personSøk = (aktorId, accessToken) =>
    spadeClient.behandlingerForPerson({ aktørId: aktorId, accessToken });

const _behandlingerForPeriod = (fom, tom, accessToken) =>
    spadeClient.behandlingerForPeriode(fom, tom, accessToken);

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
                personer: apiResponse.body.behandlinger.map(mapper)
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
