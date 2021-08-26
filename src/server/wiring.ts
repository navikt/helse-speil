import { Express } from 'express';
import { RedisClient } from 'redis';

import { devPersonClient } from './adapters/devPersonClient';
import devSpesialistClient from './adapters/devSpesialistClient';
import devOnBehalfOf from './auth/devOnBehalfOf';
import onBehalfOf from './auth/onBehalfOf';
import config from './config';
import devRedisClient from './devRedisClient';
import instrumentationModule, { Instrumentation } from './instrumentation';
import devLeggPåVentClient from './leggpåvent/devLeggPåVentClient';
import leggPåVentClient from './leggpåvent/leggPåVentClient';
import devOpptegnelseClient from './opptegnelse/devOpptegnelseClient';
import opptegnelseClient from './opptegnelse/opptegnelseClient';
import devOverstyringClient from './overstyring/devOverstyringClient';
import overstyringClient from './overstyring/overstyringClient';
import annulleringClient from './payment/annulleringClient';
import devAnnulleringClient from './payment/devAnnulleringClient';
import devVedtakClient from './payment/devVedtakClient';
import vedtakClient from './payment/vedtakClient';
import { personClient } from './person/personClient';
import spesialistClient from './person/spesialistClient';
import redisClient from './redisClient';
import tildelingClient from './tildeling/tildelingClient';
import { Helsesjekk } from './types';

const getDependencies = (app: Express, helsesjekk: Helsesjekk) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app, helsesjekk);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _tildelingClient = tildelingClient(config.oidc, devOnBehalfOf);
    const _devSpesialistClient = devSpesialistClient(instrumentation);
    const _devPersonClient = devPersonClient(instrumentation);

    return {
        person: {
            spesialistClient: _devSpesialistClient,
            personClient: _devPersonClient,
            onBehalfOf: devOnBehalfOf,
            config,
        },
        payments: { vedtakClient: devVedtakClient, annulleringClient: devAnnulleringClient },
        redisClient: devRedisClient,
        overstyring: { overstyringClient: devOverstyringClient },
        tildeling: { tildelingClient: _tildelingClient },
        opptegnelse: { opptegnelseClient: devOpptegnelseClient },
        leggPåVent: { leggPåVentClient: devLeggPåVentClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express, helsesjekk: Helsesjekk) => {
    const _redisClient: RedisClient = redisClient.init(config.redis, helsesjekk);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const _vedtakClient = vedtakClient(config.oidc, _onBehalfOf);
    const _overstyringClient = overstyringClient(config.oidc, _onBehalfOf);
    const _tildelingClient = tildelingClient(config.oidc, _onBehalfOf);
    const _annulleringClient = annulleringClient(config, _onBehalfOf);
    const _spesialistClient = spesialistClient(instrumentation, config.oidc, _onBehalfOf);
    const _personClient = personClient(instrumentation, config.oidc, _onBehalfOf);
    const _opptegnelseClient = opptegnelseClient(config.oidc, _onBehalfOf);
    const _leggPåVentClient = leggPåVentClient(config.oidc, _onBehalfOf);

    return {
        person: {
            spesialistClient: _spesialistClient,
            personClient: _personClient,
            onBehalfOf: _onBehalfOf,
            config,
        },
        payments: { vedtakClient: _vedtakClient, annulleringClient: _annulleringClient },
        redisClient: _redisClient,
        overstyring: { overstyringClient: _overstyringClient },
        tildeling: { tildelingClient: _tildelingClient },
        opptegnelse: { opptegnelseClient: _opptegnelseClient },
        leggPåVent: { leggPåVentClient: _leggPåVentClient },
        instrumentation,
    };
};

export default { getDependencies };
