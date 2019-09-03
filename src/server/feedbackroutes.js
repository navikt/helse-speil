'use strict';

const storage = require('./storage');
const { ipAddressFromRequest } = require('./requestData.js');
const { log } = require('./logging');
const moment = require('moment');
const { csvMapper } = require('./feedback-csv-mapper');

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
        let fom;
        const fomFromQuery = req.query.fraogmed;
        if (fomFromQuery !== undefined) {
            try {
                fom = convertToMoment(fomFromQuery);
                log(
                    `Parsed feedback search params '${fomFromQuery}' to ${fom}.`
                );
            } catch (e) {
                console.warn(e.message);
                res.send(
                    `Det lot seg ikke gjøre å tolke '${fomFromQuery}' som en dato`
                );
                return;
            }
        }

        const feedback = await storage.loadAll().catch(err => {
            console.warn(err);
            res.sendStatus(err.statusCode || 500);
            return;
        });

        const response =
            fom !== undefined ? excludeOlderFeedback(fom, feedback) : feedback;
        log(
            `Will return ${response.length} feedbacks to client, out of ${feedback.length} fetched from storage`
        );

        const timestamp = moment().format('YYYY-MM-DDTHH.mm.ss');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=tilbakemeldinger_${timestamp}.csv`
        );
        res.setHeader('Content-Type', 'text/csv');
        const csvResponse = csvMapper(response);
        log(`Mapped CSV file is ${csvResponse.length} characters long.`);
        res.send(csvResponse);
    });

    app.put('/feedback', (req, res) => {
        log(`Storing feedback from IP address ${ipAddressFromRequest(req)}`);
        if (isInvalid(req)) {
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

const convertToMoment = dateString => {
    const norwegianMoment = moment(dateString, 'DD.MM.YYYY');
    if (norwegianMoment.isValid()) {
        return norwegianMoment;
    }
    const isoMoment = moment(dateString, 'YYYY-MM-DD');
    if (isoMoment.isValid()) {
        return isoMoment;
    }
    throw new Error('not a parseable date: ' + dateString);
};

const excludeOlderFeedback = (fom, feedback) =>
    feedback.filter(f => moment(f.value.submittedDate || -1).isAfter(fom));

const isInvalid = req => {
    return (
        !req.body.id ||
        !req.body.txt ||
        req.body.id.length === 0 ||
        req.body.id.length > 50 ||
        req.body.txt.length === 0 ||
        req.body.txt.length > 20000
    );
};

module.exports = {
    setup: setup,
    _convertToMoment: convertToMoment
};
