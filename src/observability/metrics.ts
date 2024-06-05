import { nextleton } from 'nextleton';
import prometheus from 'prom-client';

interface Counter {
    inc: (id?: string) => void;
}

class Metrics {
    public authErrorCounter = new prometheus.Counter({
        name: 'authError',
        help: 'feil som oppstår ved autentisering',
        labelNames: ['type'],
    });

    public oboCounter = new prometheus.Counter({
        name: 'onBehalfOfVeksling',
        help: 'antall ganger vi veksler ut token for å gjøre onBehalfOfKall',
        labelNames: ['targetClientId'],
    });

    public spesialistRequestHistogram = new prometheus.Histogram({
        name: 'Requesttider',
        help: 'Tid brukt på kall mot spesialist',
        labelNames: ['route'],
    });
}

export default nextleton('metrics', () => new Metrics());
