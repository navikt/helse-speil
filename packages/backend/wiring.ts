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
import totrinnsvurderingClient from './payment/totrinnsvurderingClient';
import redisClient from './redisClient';
import { Helsesjekk } from './types';

const getDependencies = (app: Express, helsesjekk: Helsesjekk) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app, helsesjekk);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const spesialistClient = SpesialistClient(config.oidc, devOnBehalfOf);
    const _devGraphQLClient = graphQLClient(config.oidc, devOnBehalfOf);
    const _totrinnsvurderingClient = totrinnsvurderingClient(config.oidc, devOnBehalfOf);
    // Fredet
    6;
    const _leggPåVentClient = leggPåVentClient(config.oidc, devOnBehalfOf);

    return {
        totrinnsvurderingClient: _totrinnsvurderingClient,
        redisClient: devRedisClient,
        spesialistClient,
        leggPåVent: { leggPåVentClient: _leggPåVentClient },
        graphql: { graphQLClient: _devGraphQLClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express, helsesjekk: Helsesjekk) => {
    const _redisClient: RedisClient = redisClient.init(config.redis, helsesjekk);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const spesialistClient = SpesialistClient(config.oidc, _onBehalfOf);
    const _leggPåVentClient = leggPåVentClient(config.oidc, _onBehalfOf);
    const _graphQLClient = graphQLClient(config.oidc, _onBehalfOf);
    const _totrinnsvurderingClient = totrinnsvurderingClient(config.oidc, _onBehalfOf);

    return {
        totrinnsvurderingClient: _totrinnsvurderingClient,
        redisClient: _redisClient,
        spesialistClient,
        leggPåVent: { leggPåVentClient: _leggPåVentClient },
        graphql: { graphQLClient: _graphQLClient },
        instrumentation,
    };
};

export default { getDependencies };
