'use strict';

const fs = require('fs');
const logger = require('../logging');
const router = require('express').Router();
const input = require('./inputhandler');
const vedtak = require('./vedtak');

let simulation;
let onBehalfOf;
let config;

const setup = ({ config: _config, onBehalfOf: _onBehalfOf }) => {
    simulation = require('./simulation').setup(_config);
    routes({ router });
    onBehalfOf = _onBehalfOf;
    config = _config;
    return router;
};

const routes = ({ router }) => {
    const simulationHandler = {
        handle: (req, res) => {
            if (!input.isValid(req.body)) {
                res.status(400).send('Invalid sak supplied');
                return;
            }
            if (process.env.NODE_ENV === 'development') {
                devSimulation(req, res);
            } else {
                prodSimulation(req, res);
            }
        }
    };

    const vedtakHandler = {
        handle: (req, res) => {
            if (!req.body.behovId || !req.body.aktørId || req.body.godkjent === undefined) {
                res.status(400).send('Både behovId, aktørId og godkjent-verdi må være tilstede');
                return;
            }
            if (process.env.NODE_ENV === 'development') {
                devSendVedtak(req, res);
            } else {
                prodSendVedtak(req, res);
            }
        }
    };

    router.post('/simulate', simulationHandler.handle);
    router.post('/vedtak', vedtakHandler.handle);
};

const prodSimulation = async (req, res) => {
    const onBehalfOfToken = await onBehalfOf.hentFor(
        config.oidc.clientIDSpenn,
        req.session.speilToken
    );
    simulation
        .simulate(input.map(req.body), onBehalfOfToken)
        .then(reply => {
            res.set('Content-Type', 'application/json');
            res.send(reply);
        })
        .catch(err => {
            logger.error(`Error while simulating payment: ${err}`);
            res.status(500).send('Error while simulating payment');
        });
};

const devSimulation = (req, res) => {
    const mockSpennData = JSON.parse(readMockData());
    res.json(mockSpennData);
};

const prodSendVedtak = async (req, res) => {
    const onBehalfOfToken = await onBehalfOf.hentFor(
        config.oidc.clientIDSpade,
        req.session.speilToken
    );
    vedtak
        .vedtak({
            behovId: req.body.behovId,
            aktørId: req.body.aktørId,
            saksbehandlerIdent: req.session.user,
            accessToken: onBehalfOfToken,
            godkjent: req.body.godkjent
        })
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            logger.error(`Feil under fatting av vedtak: ${err}`);
            res.status(500).send('Feil under fatting av vedtak');
        });
};

const devSendVedtak = (req, res) => {
    if (Math.random() > 0.5) {
        res.status(204).send();
    } else {
        res.status(500).send('Feil under fatting av vedtak');
    }
};

const readMockData = () => fs.readFileSync('__mock-data__/spenn-reply.json', 'utf-8');

module.exports = {
    setup: setup
};
