import { browserEnv } from '@/env';
import { Faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { Maybe } from '@io/graphql';

// import { TracingInstrumentation } from '@grafana/faro-web-tracing';

let faro: Maybe<Faro> = null;

export function initInstrumentation(): void {
    if (typeof window === 'undefined' || faro !== null) return;

    getFaro();
}

export function getFaro(): Maybe<Faro> {
    if (browserEnv.NEXT_PUBLIC_TELEMETRY_URL == null) return null;

    if (faro != null) return faro;
    faro = initializeFaro({
        url: browserEnv.NEXT_PUBLIC_TELEMETRY_URL,
        app: {
            name: 'speil',
            // finne en kul måte å få en commit hash fra serveren?
            version: undefined,
        },
        instrumentations: [
            ...getWebInstrumentations(),
            // new TracingInstrumentation()
        ],
    });
    return faro;
}
