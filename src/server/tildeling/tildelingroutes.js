'use strict';
const router = require('express').Router();
const storage = require('./storage');

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
                console.log(`Error while retrieving values from Redis. Error: ${err}`);
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
        storage
            .set(behandlingsId, userId)
            .then(() => {
                res.sendStatus(204);
            })
            .catch(err => {
                console.log(`Error while inserting value in Redis. Error: ${err}`);
                res.send({
                    message: `Tildeling av behandling feilet.`,
                    statusCode: 500
                });
            });
    });

    router.delete('/:behandlingsId', (req, res) => {
        const behandlingsId = req.params.behandlingsId;
        storage
            .del(behandlingsId)
            .then(() => {
                res.sendStatus(204);
            })
            .catch(err => {
                console.log(`Error while deleting key and value in Redis. Error: ${err}`);
                res.send({
                    message: `Sletting av tildeling feilet.`,
                    statusCode: 500
                });
            });
    });
};

module.exports = {
    setup: setup
};
