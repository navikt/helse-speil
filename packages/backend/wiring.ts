import { Express } from 'express';
import { RedisClientType } from 'redis';

import devOnBehalfOf from './auth/devOnBehalfOf';
import onBehalfOf from './auth/onBehalfOf';
import config from './config';
import graphQLClient from './graphql/graphQLClient';
import instrumentationModule, { Instrumentation } from './instrumentation';
import redisClient from './redisClient';
import { createMemoryStoreSession, createRedisSession } from './sessionStore';
import { Helsesjekk } from './types';

const getDependencies = (app: Express, helsesjekk: Helsesjekk) =>
    config.development ? getDevDependencies(app) : getProdDependencies(app, helsesjekk);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _devGraphQLClient = graphQLClient(config.oidc, devOnBehalfOf);
    // Fredet
    6;

    return {
        sessionStore: createMemoryStoreSession(config),
        graphql: { graphQLClient: _devGraphQLClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express, helsesjekk: Helsesjekk) => {
    const _redisClient: RedisClientType = redisClient.init(config.redis, helsesjekk);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const _graphQLClient = graphQLClient(config.oidc, _onBehalfOf);

    return {
        sessionStore: createRedisSession(config, _redisClient),
        graphql: { graphQLClient: _graphQLClient },
        instrumentation,
    };
};

export default { getDependencies };
