import config from './config';
import redisclient from './redisclient';
import devRedisClient from './devredisclient';

import instrumentationModule from './instrumentation';
import stsClient from './auth/stsClient';
import devStsClient from './auth/devStsClient';
import onBehalfOf from './auth/onbehalfof';
import sparkelClient from './adapters/sparkelClient';
import devSparkelClient from './adapters/devSparkelClient';
import aktørIdLookup from './aktørid/aktøridlookup';
import devAktørIdLookup from './aktørid/devAktørIdLookup';
import spadeClient from './adapters/spadeClient';
import devSpadeClient from './adapters/devSpadeClient';
import { Express } from 'express';
import { RedisClient } from 'redis';

const getDependencies = (app: Express) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app);

const getDevDependencies = (app: Express) => {
    const instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf.factory(config.oidc, instrumentation);
    return {
        person: {
            sparkelClient: devSparkelClient,
            aktørIdLookup: devAktørIdLookup,
            spadeClient: devSpadeClient,
            stsClient: devStsClient,
            onBehalfOf: _onBehalfOf,
            cache: devRedisClient,
            config
        },
        payments: { config: config, onBehalfOf: _onBehalfOf },
        redisClient: devRedisClient
    };
};

const getProdDependencies = (app: Express) => {
    const redisClient: RedisClient = redisclient.init(config.redis);
    aktørIdLookup.init(stsClient, config.nav);
    const instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf.factory(config.oidc, instrumentation);
    return {
        person: {
            sparkelClient,
            aktørIdLookup,
            spadeClient,
            stsClient: stsClient,
            onBehalfOf: _onBehalfOf,
            cache: redisClient,
            config
        },
        payments: { config: config, onBehalfOf: _onBehalfOf },
        redisClient
    };
};

export default { getDependencies };
