'use strict';

import { Router } from 'express';
import logger from '../logging';
import { Storage } from './storage';

const router = Router();

let storage: Storage;
const setup = (_storage: Storage) => {
    storage = _storage;
    routes(router);
    return router;
};

const routes = (router: Router) => {
    router.get('/:oppgavereferanse', (req, res) => {
        const oppgavereferanse = req.params.oppgavereferanse;
        storage
            .get(oppgavereferanse)
            .then((userId: string) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ oppgavereferanse, userId }));
            })
            .catch((err: Error) => {
                logger.info(`Error while retrieving value from Redis. Error: ${err}`);
                res.sendStatus(500);
            });
    });

    router.post('/', (req, res) => {
        const { oppgavereferanse, userId } = req.body;
        if (oppgavereferanse === undefined || userId === undefined) {
            const errorMessage = `Oppgavereferanse '${oppgavereferanse}' and/or userId '${userId}' is not valid.`;
            logger.info(`Assign case: ${errorMessage}`);
            res.status(400).send(errorMessage);
            return;
        }
        storage
            .assignCase(oppgavereferanse, userId)
            .then(async (result: string) => {
                if (result === 'OK') {
                    logger.info(`Case ${oppgavereferanse} has been assigned to ${userId}.`);
                    return res.sendStatus(204);
                } else {
                    const assignedUser = await storage.get(oppgavereferanse);
                    if (assignedUser) {
                        return res.status(409).json({ alreadyAssignedTo: assignedUser });
                    } else {
                        logger.info(`Error while assigning case ${oppgavereferanse}`);
                        return res.sendStatus(500);
                    }
                }
            })
            .catch((err: Error) => {
                logger.info(`Error while inserting value in Redis. Error: ${err}`);
                return res.send({
                    message: `Tildeling av oppgave feilet.`,
                    statusCode: 500,
                });
            });
    });

    router.delete('/:oppgavereferanse', (req, res) => {
        const oppgavereferanse = req.params.oppgavereferanse;
        if (oppgavereferanse === undefined) {
            const errorMessage = `Oppgavereferanse '${oppgavereferanse}' is not valid.`;
            logger.info(`Unassign case: ${errorMessage}`);
            res.status(400).send(errorMessage);
            return;
        }
        storage
            .unassignCase(oppgavereferanse)
            .then((fjernetTildeling: boolean) => {
                fjernetTildeling
                    ? logger.info(`Oppgaven ${oppgavereferanse} er ikke lenger tildelt.`)
                    : logger.info(`Ingen tildeling å fjerne for oppgave ${oppgavereferanse}`);
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
