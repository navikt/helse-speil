'use strict';

const moment = require('moment');
const utils = require('./utils');
const storage = require('./storage');
const { ipAddressFromRequest } = require('../requestData.js');
const { csvMapper } = require('./feedback-csv-mapper');
const { log } = require('../logging');

const ContentType = {
    JSON: 'application/json',
    CSV: 'text/csv'
};

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

    app.get('/feedback', async (req, res) => {
        const date = await utils.parseDate(req.query.fraogmed).catch(err => {
            res.send(err);
            return;
        });

        storage
            .loadAll()
            .then(feedback => {
                const response = date
                    ? utils.excludeOlderFeedback(date, feedback)
                    : feedback;
                log(
                    `Will return ${response.length} feedbacks to client, out of ${feedback.length} fetched from storage`
                );

                if (req.accepts(ContentType.CSV)) {
                    const csvFeedback = csvMapper(response);
                    const timestamp = moment().format('YYYY-MM-DDTHH.mm.ss');
                    log(
                        `Mapped CSV file is ${csvFeedback.length} characters long.`
                    );
                    res.setHeader(
                        'Content-Disposition',
                        `attachment; filename=tilbakemeldinger_${timestamp}.csv`
                    );
                    res.setHeader('Content-Type', ContentType.CSV);
                    res.send(csvFeedback);
                } else {
                    res.setHeader('Content-Type', ContentType.JSON);
                    res.send(response);
                }
            })
            .catch(err => {
                console.warn(err);
                res.sendStatus(err.statusCode || 500);
            });
    });

    app.put('/feedback', (req, res) => {
        log(`Storing feedback from IP address ${ipAddressFromRequest(req)}`);
        if (utils.isInvalid(req)) {
            log(`Rejecting feedback due to validation error`);
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

module.exports = {
    setup: setup
};
