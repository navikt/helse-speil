import { nextleton } from 'nextleton';
import prometheus from 'prom-client';

class Metrics {
    public authErrorCounter = new prometheus.Counter({
        name: 'speil_auth_error_total',
        help: 'Errors occurring during authentication',
        labelNames: ['type'],
    });

    public oboCounter = new prometheus.Counter({
        name: 'speil_on_behalf_of_exchange_total',
        help: 'Number of times tokens are exchanged for on-behalf-of calls',
        labelNames: ['target_client_id'],
    });

    public spesialistRequestHistogram = new prometheus.Histogram({
        name: 'speil_spesialist_request_duration_seconds',
        help: 'Time spent on calls to specialist',
        labelNames: ['route'],
    });
}

export const metrics = nextleton('metrics', () => new Metrics());
