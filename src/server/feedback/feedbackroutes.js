'use strict';

const fs = require('fs');
const storage = require('./storage');
const logger = require('../logging');
const { ipAddressFromRequest } = require('../requestData.js');
const { excludeOlderFeedback, isInvalid, parseDate, prepareCsvFeedback } = require('./utils');
const router = require('express').Router();

let counter = null;

const setup = ({ config, instrumentation }) => {
    routes({ router });
    counter = instrumentation.feedbackCounter();
    storage
        .init(config.s3url, config.s3AccessKey, config.s3SecretKey)
        .then(() => {
            logger.info(`Feedback storage at ${config.s3url}`);
        })
        .catch(err => {
            logger.error(
                `Failed to setup feedback storage: ${err}. Routes for storing and retrieving feedback will not work, as setup will not be retried.`
            );
        });

    return router;
};

const routes = ({ router }) => {
    router.post('/list', (req, res) => {
        if (process.env.NODE_ENV === 'development') {
            const filename = 'feedback.json';
            fs.readFile(`__mock-data__/${filename}`, (err, data) => {
                if (err) {
                    logger.error(err);
                    res.sendStatus(500);
                }
                res.header('Content-Type', 'application/json; charset=utf-8');
                res.send(data);
            });
            return;
        }
        let behandlingsIdList = req.body;
        storage
            .loadSome(behandlingsIdList)
            .then(loadResult => {
                res.setHeader('Content-Type', loadResult.ContentType || 'application/octet-stream');
                res.send(loadResult.filter(feedback => feedback !== undefined));
            })
            .catch(err => {
                logger.error(`Error while fetching feedback for list: ${err}`);
                res.sendStatus(err.statusCode || 500);
            });
    });

    router.get('/:behandlingsId', (req, res) => {
        const behandlingsId = req.params.behandlingsId;

        storage
            .load(behandlingsId)
            .then(loadResult => {
                res.setHeader('Content-Type', loadResult.ContentType || 'application/octet-stream');
                res.send(loadResult.Body.toString());
            })
            .catch(err => {
                if (err.code !== 'NoSuchKey') {
                    logger.error(err);
                }
                res.sendStatus(err.statusCode || 500);
            });
    });

    router.get('/', async (req, res) => {
        const date = parseDate(req.query.fraogmed);

        storage
            .loadAll()
            .then(response => {
                const feedback = date ? excludeOlderFeedback(date, response) : response;
                logger.info(`Will return ${feedback.length} feedbacks out of ${response.length}`);
                if (req.accepts('csv')) {
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

    router.put('/', (req, res) => {
        logger.info(`Storing feedback from IP address ${ipAddressFromRequest(req)}`);
        if (isInvalid(req)) {
            logger.info(`Rejecting feedback due to validation error`);
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
                    logger.error(`Error while saving feedback: ${err.message}`);
                    res.send({
                        message: `Lagring av tilbakemeldinger feilet`,
                        statusCode: 500
                    });
                });
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
