'use strict';

const storage = require('./storage');

const setup = (app, config) => {
    return new Promise((resolve, reject) => {
        storage
            .init(config.s3url, config.s3AccessKey, config.s3SecretKey)
            .then(() => {
                routes(app);
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    });
};

const routes = app => {
    app.get('/feedback/:behandlingsId', (req, res) => {
        const behandlingsId = req.params.behandlingsId;
        storage
            .load(behandlingsId)
            .then(loadResult => {
                res.setHeader(
                    'Content-Type',
                    loadResult.ContentType || 'application/octet-stream'
                );
                res.send(loadResult.Body.toString());
            })
            .catch(err => {
                if (err.code !== 'NoSuchKey') {
                    console.log(err);
                }
                res.sendStatus(err.statusCode || 500);
            });
    });

    app.put('/feedback', (req, res) => {
        if (isInvalid(req)) {
            res.sendStatus(400);
        } else {
            storage
                .save(req.body.id, req.body.txt, 'text/plain')
                .then(() => {
                    res.sendStatus(204);
                })
                .catch(err => {
                    console.log(`Error while saving feedback: ${err}`);
                    res.sendStatus(500);
                });
        }
    });
};

const isInvalid = req => {
    return (
        !req.body.id ||
        !req.body.txt ||
        req.body.id.length === 0 ||
        req.body.id.length > 50 ||
        req.body.txt.length === 0 ||
        req.body.txt.length > 1000
    );
};

module.exports = {
    setup: setup
};
