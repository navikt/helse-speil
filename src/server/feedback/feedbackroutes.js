'use strict';

const storage = require('./storage');
const { log } = require('../logging');
const { ipAddressFromRequest } = require('../requestData.js');
const { excludeOlderFeedback, isInvalid, parseDate, prepareCsvFeedback } = require('./utils');

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
                res.setHeader('Content-Type', loadResult.ContentType || 'application/octet-stream');
                res.send(loadResult.Body.toString());
            })
            .catch(err => {
                if (err.code !== 'NoSuchKey') {
                    console.log(err);
                }
                res.sendStatus(err.statusCode || 500);
            });
    });

    app.get('/feedback', async (req, res) => {
        const date = parseDate(req.query.fraogmed);

        storage
            .loadAll()
            .then(response => {
                const feedback = date ? excludeOlderFeedback(date, response) : response;
                log(`Will return ${feedback.length} feedbacks out of ${response.length}`);
                if (res.accepts('csv')) {
                    const csvResponse = prepareCsvFeedback(feedback, res);
                    res.send(csvResponse);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(feedback);
                }
            })
            .catch(err => {
                console.warn(err);
                res.sendStatus(err.statusCode || 500);
            });
    });

    app.put('/feedback', (req, res) => {
        log(`Storing feedback from IP address ${ipAddressFromRequest(req)}`);
        if (isInvalid(req)) {
            log(`Rejecting feedback due to validation error`);
            res.send({
                message: 'Lagring av tilbakemeldinger feilet pga. valideringsfeil',
                statusCode: 400
            });
        } else {
            storage
                .save(req.body.id, req.body.txt, 'text/plain')
                .then(() => {
                    res.sendStatus(204);
                })
                .catch(err => {
                    console.log(`Error while saving feedback: ${err.message}`);
                    res.send({
                        message: `Lagring av tilbakemeldinger feilet: ${err.message}`,
                        statusCode: err.statusCode || 500
                    });
                });
        }
    });
};

module.exports = {
    setup
};
