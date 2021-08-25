import { Express } from 'express';
import prometheus from 'prom-client';

const setup = (app: Express): Instrumentation => {
    prometheus.collectDefaultMetrics({ eventLoopMonitoringPrecision: 5000 });
    routes(app);
    const _requestHistogram = requestHistogram();
    return {
        onBehalfOfCounter,
        authError,
        requestHistogram: _requestHistogram,
    };
};

interface Counter {
    inc: (id?: string) => void;
}

export interface Instrumentation {
    onBehalfOfCounter: () => Counter;
    authError: () => Counter;
    requestHistogram: Histogram;
}

interface Histogram {
    startTidtakning: (url: string) => (labels?: Partial<Record<'route', string | number>> | undefined) => void;
}

const onBehalfOfCounter = () => {
    const counter = new prometheus.Counter({
        name: 'onBehalfOfVeksling',
        help: 'antall ganger vi veksler ut token for å gjøre onBehalfOfKall',
        labelNames: ['targetClientId'],
    });

    return {
        inc: (clientId: string) => {
            counter.inc({
                targetClientId: clientId,
            });
        },
    };
};

const authError = () => {
    const counter = new prometheus.Counter({
        name: 'authError',
        help: 'feil som oppstår ved autentisering',
    });

    return {
        inc: () => {
            counter.inc();
        },
    };
};

const requestHistogram = () => {
    const histogram = new prometheus.Histogram({
        name: 'Requesttider',
        help: 'Tid brukt på kall mot spesialist',
        labelNames: ['route'],
    });

    return {
        startTidtakning: (url: string) => histogram.startTimer({ route: url }),
    };
};

const routes = (app: Express) => {
    app.get('/metrics', (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        prometheus.register.metrics().then((metrics) => res.end(metrics));
    });
};

export default { setup };
