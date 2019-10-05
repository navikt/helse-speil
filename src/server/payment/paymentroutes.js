'use strict';

const fs = require('fs');
const logger = require('../logging');
const router = require('express').Router();
const input = require('./inputhandler');

let simulation;

const setup = ({ config }) => {
    simulation = require('./simulation').setup(config);
    routes({ router });
    return router;
};

const routes = ({ router }) => {
    const requestHandler = {
        handle: (req, res) => {
            if (!input.isValid(req.body)) {
                res.status(400).send('invalid behndling supplied');
                return;
            }
            if (process.env.NODE_ENV === 'development') {
                devSimulation(req, res);
            } else {
                prodSimulation(req, res);
            }
        }
    };

    router.post('/simulate', requestHandler.handle);
};

const devSimulation = (req, res) => {
    const mockSpennData = JSON.parse(readMockData());
    res.json(mockSpennData);
};

const prodSimulation = (req, res) => {
    simulation
        .simulate(input.map(req.body))
        .then(reply => {
            res.set('Content-Type', 'application/json');
            res.send(reply);
        })
        .catch(err => {
            logger.error(`Error while simulating payment: ${err}`);
            res.status(500).send('Error while simulating payment');
        });
};

const readMockData = () => fs.readFileSync('__mock-data__/spenn-reply.json', 'utf-8');

module.exports = {
    setup: setup
};
