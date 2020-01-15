import prometheus from 'prom-client';
import { Express } from 'express';

const setup = (app: Express) => {
    prometheus.collectDefaultMetrics({ timeout: 5000 });
    routes(app);
    return {
        onBehalfOfCounter
    };
};

const onBehalfOfCounter = () => {
    const counter = new prometheus.Counter({
        name: 'onBehalfOfVeksling',
        help: 'antall ganger vi veksler ut token for å gjøre onBehalfOfKall',
        labelNames: ['targetClientId']
    });

    return {
        inc: (clientId: string) => {
            counter.inc({
                targetClientId: clientId
            });
        }
    };
};

const routes = (app: Express) => {
    app.get('/metrics', (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        res.end(prometheus.register.metrics());
    });
};

export default { setup };
