'use strict';

const fs = require('fs');
const logger = require('../logging');
const router = require('express').Router();
const input = require('./inputhandler');
const godkjenning = require('./godkjenning');

let simulation;

const setup = ({ config }) => {
    simulation = require('./simulation').setup(config);
    routes({ router });
    return router;
};

const routes = ({ router }) => {
    const simulationHandler = {
        handle: (req, res) => {
            if (!input.isValid(req.body)) {
                res.status(400).send('invalid behandling supplied');
                return;
            }
            if (process.env.NODE_ENV === 'development') {
                devSimulation(req, res);
            } else {
                prodSimulation(req, res);
            }
        }
    };

    const approvalHandler = {
        handle: (req, res) => {
            if (!req.body.behovId || !req.body.aktørId) {
                res.status(400).send('både behovId og aktørId må være tilstede');
                return;
            }
            if (process.env.NODE_ENV === 'development') {
                devApprovePayment(req, res);
            } else {
                prodApprovePayment(req, res);
            }
        }
    };

    router.post('/simulate', simulationHandler.handle);
    router.post('/approve', approvalHandler.handle);
};

const prodSimulation = (req, res) => {
    simulation
        .simulate(input.map(req.body), req.session.spadeToken)
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

const prodApprovePayment = (req, res) => {
    godkjenning
        .godkjenn({
            behovId: req.body.behovId,
            aktørId: req.body.aktørId,
            saksbehandler: req.session.user,
            token: req.session.spadeToken
        })
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            logger.error(`Feil under godkjenning av utbetaling: ${err}`);
            res.status(500).send('Feil under godkjenning av utbetaling');
        });
};

const devApprovePayment = (req, res) => {
    if (Math.random() > 0.5) {
        res.status(204).send();
    } else {
        res.status(500).send('Feil under godkjenning av utbetaling');
    }
};

const readMockData = () => fs.readFileSync('__mock-data__/spenn-reply.json', 'utf-8');

module.exports = {
    setup: setup
};
