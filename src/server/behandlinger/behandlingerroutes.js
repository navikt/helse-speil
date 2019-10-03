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
    router.get('/', async (req, res) => {
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

        if (process.env.NODE_ENV === 'development') {
            sendDevResponse(res, personId);
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
                        behandlinger: apiResponse.body.behandlinger.map(behandling =>
                            mapping.alle(behandling)
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
    });

    router.get('/periode/:fom/:tom', (req, res) => {
        if (process.env.NODE_ENV === 'development') {
            sendBehandlingerSummaryDevResponse(res);
            return;
        }

        const accessToken = req.session.spadeToken;
        const fom = req.params.fom;
        const tom = req.params.tom;
        api.behandlingerIPeriode(fom, tom, accessToken)
            .then(apiResponse => {
                res.status(apiResponse.statusCode);
                res.send({
                    behandlinger: apiResponse.body.behandlinger.map(behandlingSummary =>
                        mapping.fromBehandlingSummary(behandlingSummary)
                    )
                });
            })
            .catch(err => {
                console.error(
                    `Kunne ikke hente behandlinger for perioden ${fom} - ${tom}. Feil: ${err}`
                );
                res.sendStatus(500);
            });
    });
};

const sendBehandlingerSummaryDevResponse = res => {
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

const sendDevResponse = (res, personId) => {
    const filename =
        !personId || personId.charAt(0) < 5 || personId.charAt(0) !== 7
            ? 'behandlinger.json'
            : 'behandlinger_mapped.json';
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

module.exports = {
    setup: setup
};
