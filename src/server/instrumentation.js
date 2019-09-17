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
        labelNames: ['result']
    });

    return {
        agree: () => {
            counter.inc({
                result: 'agree'
            });
        },
        disagree: () => {
            counter.inc({
                result: 'disagree'
            });
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
