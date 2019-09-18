'use strict';

const fs = require('fs');
const { log } = require('../logging');
const mapping = require('./mapping');
const api = require('./behandlingerlookup');
const aktøridlookup = require('../aktørid/aktøridlookup');
const { isValidSsn } = require('../aktørid/ssnvalidation');

const setup = ({ app, stsclient, config }) => {
    aktøridlookup.init(stsclient, config);

    app.get('/behandlinger/', async (req, res) => {
        const personId = req.headers['nav-person-id'];
        if (process.env.NODE_ENV === 'development') {
            sendDevResponse(personId, res);
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
                apiResponse => {
                    const fnr =
                        aktorId !== personId
                            ? personId
                            : aktøridlookup.hentFnr(aktorId).catch(err => {
                                  console.log(err);
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
};

const sendDevResponse = (personId, res) => {
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

module.exports = {
    setup: setup
};
