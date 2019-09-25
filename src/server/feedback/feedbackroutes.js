'use strict';

const fs = require('fs');
const storage = require('./storage');
const { log } = require('../logging');
const { ipAddressFromRequest } = require('../requestData.js');
const { excludeOlderFeedback, isInvalid, parseDate, prepareCsvFeedback } = require('./utils');

let counter = null;

const setup = (app, config, instrumentation) => {
    counter = instrumentation.feedbackCounter();
    return new Promise((resolve, reject) => {
        storage
            .init(config.s3url, config.s3AccessKey, config.s3SecretKey)
            .then(() => {
                routes(app);
                resolve();
            })
            .catch(err => {
                if (process.env.NODE_ENV === 'development') {
                    devRoutes(app);
                    resolve();
                } else {
                    reject(err);
                }
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

    app.get('/feedback/list', (req, res) => {
        const behandlingsIdList = req.query.id;
        storage
            .loadSome(behandlingsIdList)
            .then(loadResult => {
                res.setHeader('Content-Type', loadResult.ContentType || 'application/octet-stream');
                res.send(loadResult);
            })
            .catch(err => {
                console.log(`Error while fetching feedback for list: ${err.message}`);
                res.sendStatus(err.statusCode || 500);
            });
    });

    app.put('/feedback', (req, res) => {
        log(`Storing feedback from IP address ${ipAddressFromRequest(req)}`);
        if (isInvalid(req)) {
            log(`Rejecting feedback due to validation error`);
            res.send({
                message: 'Lagring av tilbakemelding feilet pga. valideringsfeil',
                statusCode: 400
            });
        } else {
            reportMetrics(req.body);
            storage
                .save(req.body.id, req.body.txt, 'text/plain')
                .then(() => {
                    res.sendStatus(204);
                })
                .catch(err => {
                    console.log(`Error while saving feedback: ${err.message}`);
                    res.send({
                        message: `Lagring av tilbakemeldinger feilet`,
                        statusCode: 500
                    });
                });
        }
    });
};

const devRoutes = app => {
    app.get('/feedback/list', (req, res) => {
        if (process.env.NODE_ENV === 'development') {
            const filename = 'feedback.json';
            fs.readFile(`__mock-data__/${filename}`, (err, data) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
                res.header('Content-Type', 'application/json; charset=utf-8');
                res.send(data);
            });
            return;
        }
    });
};

const reportMetrics = requestBody => {
    try {
        const parsed = JSON.parse(requestBody.txt);
        if (parsed.uenigheter.length == 0) {
            counter.agree();
        } else {
            counter.disagree();
        }
    } catch (err) {
        console.error(`Unable to report metrics: ${err}`);
    }
};

module.exports = {
    setup
};
