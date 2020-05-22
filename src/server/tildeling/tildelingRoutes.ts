'use strict';

import { Router } from 'express';
import storage from './storage';
import logger from '../logging';
import { RedisClient } from 'redis';

const router = Router();

const setup = (client: RedisClient) => {
    storage.init(client);
    routes(router);
    return router;
};

const routes = (router: Router) => {
    router.post('/list', (req, res) => {
        const behovIdList = req.body;
        storage
            .getAll(behovIdList)
            .then((result) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            })
            .catch((err) => {
                logger.info(`Error while retrieving values from Redis: ${err}`);
                res.sendStatus(err.statusCode || 500);
            });
    });

    router.get('/:behovId', (req, res) => {
        const behovId = req.params.behovId;
        storage
            .get(behovId)
            .then((userId: string) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ behovId, userId }));
            })
            .catch((err: Error) => {
                logger.info(`Error while retrieving value from Redis. Error: ${err}`);
                res.sendStatus(500);
            });
    });

    router.post('/', (req, res) => {
        const { behovId, userId } = req.body;
        if (behovId === undefined || userId === undefined) {
            const errorMessage = `behovId '${behovId}' and/or userId '${userId}' is not valid.`;
            logger.info(`Assign case: ${errorMessage}`);
            res.status(400).send(errorMessage);
            return;
        }
        storage
            .assignCase(behovId, userId)
            .then(async (result: string) => {
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
            .catch((err: Error) => {
                logger.info(`Error while inserting value in Redis. Error: ${err}`);
                return res.send({
                    message: `Tildeling av behov feilet.`,
                    statusCode: 500,
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
            .catch((err: Error) => {
                logger.info(`Error while deleting key in Redis: ${err}`);
                res.status(500).send({
                    message: `Sletting av tildeling feilet.`,
                });
            });
    });
};

export default { setup };
