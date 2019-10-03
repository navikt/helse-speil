'use strict';

const fs = require('fs');
const router = require('express').Router();
const { log } = require('../logging');
const mapping = require('./mapping');
const api = require('./behandlingerlookup');
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
    const handlers = {
        getBehandlinger: {
            prod: getBehandlinger,
            dev: devGetBehandlinger
        },
        getAlleBehandlinger: {
            prod: getAlleBehandlinger,
            dev: devGetAlleBehandlinger
        }
    };

    const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    router.get('/', handlers.getBehandlinger[mode]);
    router.get('/periode/:fom/:tom', handlers.getAlleBehandlinger[mode]);
};

const getBehandlinger = async (req, res) => {
    const personId = req.headers[personIdHeaderName];
    if (!personId) {
        log(
            `Missing header '${personIdHeaderName}' in request, from user ${nameFrom(
                req.session.spadeToken
            )}`
        );
        res.status(500).send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
        return;
    }

    let aktorId;
    if (isValidSsn(personId)) {
        aktorId = await aktøridlookup.hentAktørId(personId).catch(err => {
            log(`Could not fetch aktørId for ${personId}. ${err}`);
        });
        if (!aktorId) {
            res.status(500);
            res.send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
            return;
        }
    } else {
        aktorId = personId;
    }

    const accessToken = req.session.spadeToken;
    api.behandlingerFor(aktorId, accessToken)
        .then(
            async apiResponse => {
                const fnr =
                    aktorId !== personId
                        ? personId
                        : await aktøridlookup.hentFnr(aktorId).catch(err => {
                              console.log('Could not fetch NNIN from Aktørregisteret.', err);
                              return null;
                          });
                res.status(apiResponse.statusCode).send({
                    behandlinger: apiResponse.body.behandlinger.map(behandlingSummary =>
                        mapping.fromBehandlingSummary(behandlingSummary)
                    ),
                    fnr
                });
            },
            err => {
                throw Error(`Could not fetch cases: ${err.error.toString()}`);
            }
        )
        .then(null, err => {
            throw Error(`Could not map fetched cases: ${err}`);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
};

const getAlleBehandlinger = (req, res) => {
    const accessToken = req.session.spadeToken;
    const fom = req.params.fom;
    const tom = req.params.tom;
    api.behandlingerIPeriode(fom, tom, accessToken)
        .then(apiResponse => {
            res.status(apiResponse.statusCode);
            res.send({
                behandlinger: apiResponse.body.behandlinger.map(behandling =>
                    mapping.alle(behandling)
                )
            });
        })
        .catch(err => {
            console.error(
                `Kunne ikke hente behandlinger for perioden ${fom} - ${tom}. Feil: ${err}`
            );
            res.sendStatus(500);
        });
};

const devGetBehandlinger = (req, res) => {
    const personId = req.headers[personIdHeaderName];
    if (!personId) {
        log(
            `Missing header '${personIdHeaderName}' in request, from user ${nameFrom(
                req.session.spadeToken
            )}`
        );
        res.status(500).send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
        return;
    }

    const filename = personId.charAt(0) < 5 ? 'behandlinger.json' : 'behandlinger_mapped.json';
    fs.readFile(`__mock-data__/${filename}`, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }

        let behandlingerToReturn;
        if (filename.indexOf('mapped') > -1) {
            behandlingerToReturn = JSON.parse(data);
        } else {
            behandlingerToReturn = JSON.parse(data).behandlinger.map(behandling =>
                mapping.alle(behandling)
            );
        }
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({
            fnr: personId,
            behandlinger: behandlingerToReturn
        });
    });
};

const devGetAlleBehandlinger = (_req, res) => {
    fs.readFile(`__mock-data__/behandlingsummaries.json`, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        const behandlingerToReturn = JSON.parse(data).behandlinger.map(behandling =>
            mapping.fromBehandlingSummary(behandling)
        );
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({
            behandlinger: behandlingerToReturn
        });
    });
};

module.exports = {
    setup
};
