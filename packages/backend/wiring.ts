import { Express } from 'express';
import { RedisClient } from 'redis';

import devOnBehalfOf from './auth/devOnBehalfOf';
import onBehalfOf from './auth/onBehalfOf';
import config from './config';
import devRedisClient from './devRedisClient';
import graphQLClient from './graphql/graphQLClient';
import SpesialistClient from './http/spesialistClient';
import instrumentationModule, { Instrumentation } from './instrumentation';
import redisClient from './redisClient';
import { Helsesjekk } from './types';

const getDependencies = (app: Express, helsesjekk: Helsesjekk) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app, helsesjekk);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const spesialistClient = SpesialistClient(config.oidc, devOnBehalfOf);
    const _devGraphQLClient = graphQLClient(config.oidc, devOnBehalfOf);
    // Fredet
    6;

    return {
        redisClient: devRedisClient,
        spesialistClient,
        graphql: { graphQLClient: _devGraphQLClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express, helsesjekk: Helsesjekk) => {
    const _redisClient: RedisClient = redisClient.init(config.redis, helsesjekk);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const spesialistClient = SpesialistClient(config.oidc, _onBehalfOf);
    const _graphQLClient = graphQLClient(config.oidc, _onBehalfOf);

    return {
        redisClient: _redisClient,
        spesialistClient,
        graphql: { graphQLClient: _graphQLClient },
        instrumentation,
    };
};

export default { getDependencies };
