'use strict';
const router = require('express').Router();
const storage = require('./storage');
const logger = require('../logging');

const setup = redisclient => {
    storage.init(redisclient);
    routes({ router });
    return router;
};

routes;

const routes = ({ router }) => {
    router.post('/list', (req, res) => {
        const behandlingsIdList = req.body;
        storage
            .getAll(behandlingsIdList)
            .then(result => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            })
            .catch(err => {
                logger.info(`Error while retrieving values from Redis: ${err}`);
                res.sendStatus(err.statusCode || 500);
            });
    });

    router.get('/:behandlingsId', (req, res) => {
        const behandlingsId = req.params.behandlingsId;
        storage
            .get(behandlingsId)
            .then(result => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ behandlingsId: behandlingsId, userId: result }));
            })
            .catch(err => {
                console.log(`Error while retrieving value from Redis. Error: ${err}`);
                res.sendStatus(err.statusCode || 500);
            });
    });

    router.post('/', (req, res) => {
        const { behandlingsId, userId } = req.body;
        if (behandlingsId === undefined || userId === undefined) {
            const errorMessage = `behandlingsId '${behandlingsId}' and/or userId '${userId}' is not valid.`;
            logger.info(`Assign case: ${errorMessage}`);
            return res.status(400).send(errorMessage);
        }
        storage
            .assignCase(behandlingsId, userId)
            .then(async result => {
                if (result === 'OK') {
                    logger.info(`Case ${behandlingsId} has been assigned to ${userId}.`);
                    return res.sendStatus(204);
                } else {
                    const assignedUser = await storage.get(behandlingsId);
                    if (assignedUser) {
                        return res.status(409).json({ alreadyAssignedTo: assignedUser });
                    } else {
                        logger.info(`Error while unassigning case ${behandlingsId}`);
                        return res.sendStatus(500);
                    }
                }
            })
            .catch(err => {
                logger.info(`Error while inserting value in Redis. Error: ${err}`);
                return res.send({
                    message: `Tildeling av behandling feilet.`,
                    statusCode: 500
                });
            });
    });

    router.delete('/:behandlingsId', (req, res) => {
        const behandlingsId = req.params.behandlingsId;
        if (behandlingsId === undefined) {
            const errorMessage = `behandlingsId '${behandlingsId}' is not valid.`;
            console.log(`Unassign case: ${errorMessage}`);
            res.status(400).send(errorMessage);
            return;
        }
        storage
            .unassignCase(behandlingsId)
            .then(() => {
                console.log(`The case ${behandlingsId} is no longer assigned.`);
                res.sendStatus(204);
            })
            .catch(err => {
                console.log(`Error while deleting key in Redis: ${err}`);
                res.status(500).send({
                    message: `Sletting av tildeling feilet.`
                });
            });
    });
};

module.exports = {
    setup: setup
};
