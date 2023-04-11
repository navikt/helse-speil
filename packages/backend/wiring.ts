import leggPåVentClient from './leggpåvent/leggPåVentClient';
import { Express } from 'express';
import { RedisClient } from 'redis';

import devOnBehalfOf from './auth/devOnBehalfOf';
import onBehalfOf from './auth/onBehalfOf';
import config from './config';
import devRedisClient from './devRedisClient';
import graphQLClient from './graphql/graphQLClient';
import SpesialistClient from './http/spesialistClient';
import instrumentationModule, { Instrumentation } from './instrumentation';
import notatClient from './notat/notatClient';
import overstyringClient from './overstyring/overstyringClient';
import annulleringClient from './payment/annulleringClient';
import totrinnsvurderingClient from './payment/totrinnsvurderingClient';
import vedtakClient from './payment/vedtakClient';
import redisClient from './redisClient';
import { Helsesjekk } from './types';

const getDependencies = (app: Express, helsesjekk: Helsesjekk) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app, helsesjekk);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const spesialistClient = SpesialistClient(config.oidc, devOnBehalfOf);
    const _devGraphQLClient = graphQLClient(config.oidc, devOnBehalfOf);
    const _totrinnsvurderingClient = totrinnsvurderingClient(config.oidc, devOnBehalfOf);
    const _annulleringClient = annulleringClient(config, devOnBehalfOf);
    const _notatClient = notatClient(config.oidc, devOnBehalfOf);
    const _vedtakClient = vedtakClient(config.oidc, devOnBehalfOf);
    // Fredet
    6;
    const _overstyringClient = overstyringClient(config.oidc, devOnBehalfOf);
    const _leggPåVentClient = leggPåVentClient(config.oidc, devOnBehalfOf);

    return {
        payments: {
            vedtakClient: _vedtakClient,
            annulleringClient: _annulleringClient,
            totrinnsvurderingClient: _totrinnsvurderingClient,
        },
        redisClient: devRedisClient,
        spesialistClient,
        overstyring: { overstyringClient: _overstyringClient },
        leggPåVent: { leggPåVentClient: _leggPåVentClient },
        notat: { notatClient: _notatClient },
        graphql: { graphQLClient: _devGraphQLClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express, helsesjekk: Helsesjekk) => {
    const _redisClient: RedisClient = redisClient.init(config.redis, helsesjekk);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const spesialistClient = SpesialistClient(config.oidc, _onBehalfOf);
    const _vedtakClient = vedtakClient(config.oidc, _onBehalfOf);
    const _overstyringClient = overstyringClient(config.oidc, _onBehalfOf);
    const _annulleringClient = annulleringClient(config, _onBehalfOf);
    const _leggPåVentClient = leggPåVentClient(config.oidc, _onBehalfOf);
    const _notatClient = notatClient(config.oidc, _onBehalfOf);
    const _graphQLClient = graphQLClient(config.oidc, _onBehalfOf);
    const _totrinnsvurderingClient = totrinnsvurderingClient(config.oidc, _onBehalfOf);

    return {
        payments: {
            vedtakClient: _vedtakClient,
            annulleringClient: _annulleringClient,
            totrinnsvurderingClient: _totrinnsvurderingClient,
        },
        redisClient: _redisClient,
        spesialistClient,
        overstyring: { overstyringClient: _overstyringClient },
        leggPåVent: { leggPåVentClient: _leggPåVentClient },
        notat: { notatClient: _notatClient },
        graphql: { graphQLClient: _graphQLClient },
        instrumentation,
    };
};

export default { getDependencies };
