import config from './config';
import redisClient from './redisClient';
import devRedisClient from './devRedisClient';

import instrumentationModule from './instrumentation';
import stsClient from './auth/stsClient';
import devStsClient from './auth/devStsClient';
import onBehalfOf from './auth/onBehalfOf';
import sparkelClient from './adapters/sparkelClient';
import devSparkelClient from './adapters/devSparkelClient';
import spleisClient from './person/spleisClient';
import devSpleisClient from './person/devSpleisClient';
import vedtakClient from './payment/vedtakClient';
import devVedtakClient from './payment/devVedtakClient';
import aktørIdLookup from './aktørid/aktørIdLookup';
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
            spleisClient: devSpleisClient,
            sparkelClient: devSparkelClient,
            aktørIdLookup: devAktørIdLookup,
            spadeClient: devSpadeClient,
            stsClient: devStsClient,
            onBehalfOf: _onBehalfOf,
            cache: devRedisClient,
            config
        },
        payments: { config: config, onBehalfOf: _onBehalfOf, vedtakClient: devVedtakClient },
        redisClient: devRedisClient
    };
};

const getProdDependencies = (app: Express) => {
    const _redisClient: RedisClient = redisClient.init(config.redis);
    aktørIdLookup.init(stsClient, config.nav);
    const instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf.factory(config.oidc, instrumentation);
    const _vedtakClient = vedtakClient(config.oidc, _onBehalfOf);
    return {
        person: {
            spleisClient,
            sparkelClient,
            aktørIdLookup,
            spadeClient,
            stsClient: stsClient,
            onBehalfOf: _onBehalfOf,
            cache: _redisClient,
            config
        },
        payments: { config: config, onBehalfOf: _onBehalfOf, vedtakClient: _vedtakClient },
        redisClient: _redisClient
    };
};

export default { getDependencies };
