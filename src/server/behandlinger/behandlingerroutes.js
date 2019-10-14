'use strict';

const router = require('express').Router();
const logger = require('../logging');
const api = require('./behandlingerlookup');
const mapping = require('./mapping');
const aktøridlookup = require('../aktørid/aktøridlookup');
const { isValidSsn } = require('../aktørid/ssnvalidation');
const { nameFrom } = require('../auth/authsupport');

const personIdHeaderName = 'nav-person-id';

const setup = ({ stsclient, config }) => {
    aktøridlookup.init(stsclient, config);
    routes({ router });
    return router;
};

const routes = ({ router }) => {
    router.get('/', behandlingerForPerson);
    router.get('/periode/:fom/:tom', behandlingerForPeriod);
};

const behandlingerForPerson = async (req, res) => {
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

    respondWith(res, api.behandlingerForPerson(aktorId, req.session.spadeToken), mapping.alle);
};

const behandlingerForPeriod = (req, res) => {
    auditLog(req, fom || 'missing fom', tom || 'missing tom');

    const fom = req.params.fom;
    const tom = req.params.tom;
    if (!fom && !tom) {
        logger.error(`Missing params 'fom' and/or 'tom' in request`);
        res.status(400).send(`Påkrevde qurey params 'fom' og/eller 'tom' mangler`);
        return;
    }

    respondWith(
        res,
        api.behandlingerForPeriod(fom, tom, req.session.spadeToken),
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

const respondWith = (res, lookupPromise, mapper) => {
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
    setup
};
