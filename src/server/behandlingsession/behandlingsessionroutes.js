'use strict';
const storage = require('./storage');

const setup = (app, config) => {
    return new Promise((resolve, reject) => {
        storage
            .init(config)
            .then(client => {
                routes(app, storage);
                resolve(client);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const routes = (app, storage) => {
    app.get('/tildeling/list', (req, res) => {
        const behandlingsIdList = req.query.id;

        if (Array.isArray(behandlingsIdList)) {
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
        } else {
            // Kun én behandlingsId, som string
            storage
                .get(behandlingsIdList)
                .then(result => {
                    res.setHeader('Content-Type', 'application/json').send(
                        JSON.stringify({ behandlingsId: behandlingsIdList, userId: result })
                    );
                })
                .catch(err => {
                    console.log(`Error while retrieving value from Redis. Error: ${err}`);
                    res.sendStatus(err.statusCode || 500);
                });
        }
    });

    app.get('/tildeling/:behandlingsId', (req, res) => {
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

    app.post('/tildeling', (req, res) => {
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

    app.delete('/tildeling/:behandlingsId', (req, res) => {
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
