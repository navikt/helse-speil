'use strict';

const moment = require('moment');

const logger = require('../logging');
const { isValidSsn } = require('../aktørid/ssnvalidation');
const { valueFromClaim } = require('../auth/authsupport');
const spleis = require('./spleisClient');

const personIdHeaderName = 'nav-person-id';

const sakSøk = ({ onBehalfOf, spleisId, toAktørId }) => async (req, res) => {
    const undeterminedId = req.headers[personIdHeaderName];
    const innsyn = req.headers['innsyn'] === 'true';

    auditLog(req, undeterminedId || 'missing person id');
    if (!undeterminedId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    const aktørId = isValidSsn(undeterminedId) ? await toAktørId(undeterminedId) : undeterminedId;
    if (!aktørId) {
        return res.status(404).send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
    }

    return respondWith({
        res,
        lookupPromise: onBehalfOf.hentFor(spleisId, req.session.speilToken).then(token => {
            return (innsyn ? spleis.hentSakByUtbetalingsref : spleis.hentSak)(aktørId, token);
        }),
        mapper: response => ({
            person: response.body
        })
    });
};

const behovForPeriode = ({ onBehalfOf, spadeId, spadeClient }) => (req, res) => {
    auditLog(req);

    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

    respondWith({
        res,
        lookupPromise: onBehalfOf
            .hentFor(spadeId, req.session.speilToken)
            .then(behalfOfToken =>
                spadeClient.behandlingerForPeriode(yesterday, today, behalfOfToken)
            ),
        mapper: response => ({
            behov: response.body
        })
    });
};

const build = ({ aktørIdLookup, spadeClient, config, onBehalfOf }) => {
    const spleisId = config.oidc.clientIDSpleis;
    const spadeId = config.oidc.clientIDSpade;

    const toAktørId = async fnr =>
        await aktørIdLookup.hentAktørId(fnr).catch(err => {
            logger.error(`Could not fetch aktørId. ${err}`);
        });

    return {
        sakSøk: sakSøk({ onBehalfOf, spleisId, toAktørId }),
        behovForPeriode: behovForPeriode({ onBehalfOf, spadeId, spadeClient })
    };
};

const auditLog = (request, ...queryParams) => {
    const speilUser = valueFromClaim('name', request.session.speilToken);
    logger.audit(
        `${speilUser} is doing lookup with params: ${queryParams?.reduce(
            (previous, current) => `${previous}, ${current}`,
            ''
        )}`
    );
};

const respondWith = ({ res, lookupPromise, mapper }) => {
    return lookupPromise
        .then(apiResponse => {
            if (apiResponse === undefined) {
                logger.error('Unexpected error, missing apiResponse value');
                return res.sendStatus(503);
            }
            res.status(apiResponse.statusCode).send(mapper(apiResponse));
        })
        .catch(err => {
            logger.error(`Error during data fetching: ${err}`);
            res.sendStatus(err.statusCode || 503);
        });
};

module.exports = {
    build,
    personIdHeaderName
};
