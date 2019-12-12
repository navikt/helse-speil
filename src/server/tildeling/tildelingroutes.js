'use strict';
const router = require('express').Router();
const logger = require('../logging');

const setup = ({ storage }) => {
    routes({ router, storage });
    return router;
};

const routes = ({ router, storage }) => {
    router.post('/list', (req, res) => {
        const behovIdList = req.body;
        storage
            .getAll(behovIdList)
            .then(result => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            })
            .catch(err => {
                logger.info(`Error while retrieving values from Redis: ${err}`);
                res.sendStatus(err.statusCode || 500);
            });
    });

    router.get('/:behovId', (req, res) => {
        const behovId = req.params.behovId;
        storage
            .get(behovId)
            .then(userId => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ behovId, userId }));
            })
            .catch(err => {
                logger.info(`Error while retrieving value from Redis. Error: ${err}`);
                res.sendStatus(err.statusCode || 500);
            });
    });

    router.post('/', (req, res) => {
        const { behovId, userId } = req.body;
        if (behovId === undefined || userId === undefined) {
            const errorMessage = `behovId '${behovId}' and/or userId '${userId}' is not valid.`;
            logger.info(`Assign case: ${errorMessage}`);
            return res.status(400).send(errorMessage);
        }
        storage
            .assignCase(behovId, userId)
            .then(async result => {
                if (result === 'OK') {
                    logger.info(`Case ${behovId} has been assigned to ${userId}.`);
                    return res.sendStatus(204);
                } else {
                    const assignedUser = await storage.get(behovId);
                    if (assignedUser) {
                        return res.status(409).json({ alreadyAssignedTo: assignedUser });
                    } else {
                        logger.info(`Error while assigning case ${behovId}`);
                        return res.sendStatus(500);
                    }
                }
            })
            .catch(err => {
                logger.info(`Error while inserting value in Redis. Error: ${err}`);
                return res.send({
                    message: `Tildeling av behov feilet.`,
                    statusCode: 500
                });
            });
    });

    router.delete('/:behovId', (req, res) => {
        const behovId = req.params.behovId;
        if (behovId === undefined) {
            const errorMessage = `behovId '${behovId}' is not valid.`;
            logger.info(`Unassign case: ${errorMessage}`);
            res.status(400).send(errorMessage);
            return;
        }
        storage
            .unassignCase(behovId)
            .then(() => {
                logger.info(`The case ${behovId} is no longer assigned.`);
                res.sendStatus(204);
            })
            .catch(err => {
                logger.info(`Error while deleting key in Redis: ${err}`);
                res.status(500).send({
                    message: `Sletting av tildeling feilet.`
                });
            });
    });
};

module.exports = {
    setup: setup
};
