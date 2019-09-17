'use strict';

const prometheus = require('prom-client');

const setup = app => {
    prometheus.collectDefaultMetrics({ timeout: 5000 });
    routes(app);
    return {
        feedbackCounter: feedbackCounter
    };
};

const feedbackCounter = () => {
    const counter = new prometheus.Counter({
        name: 'feedbacks',
        help: 'nr of feedbacks submitted',
        labelNames: ['result', 'id', 'reason']
    });

    return {
        agree: id => {
            const labels = {
                result: 'agree',
                id: id
            };
            counter.inc(labels);
        },
        disagree: (id, why) => {
            const labels = {
                result: 'disagree',
                id: id,
                why: why
            };
            counter.inc(labels);
        }
    };
};

const routes = app => {
    app.get('/metrics', (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        res.end(prometheus.register.metrics());
    });
};

module.exports = {
    setup: setup
};
