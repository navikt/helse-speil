import config from './config';
import redisClient from './redisClient';
import devRedisClient from './devRedisClient';

import instrumentationModule from './instrumentation';
import stsClient from './auth/stsClient';
import devStsClient from './auth/devStsClient';
import onBehalfOf from './auth/onBehalfOf';
import devOnBehalfOf from './auth/devOnBehalfOf';
import sparkelClient from './adapters/sparkelClient';
import devSparkelClient from './adapters/devSparkelClient';
import spleisClient from './person/spleisClient';
import devSpleisClient from './person/devSpleisClient';
import vedtakClient from './payment/vedtakClient';
import devVedtakClient from './payment/devVedtakClient';
import annulleringClient from './payment/annulleringClient';
import devAnnulleringClient from './payment/devAnnulleringClient';
import aktørIdLookup from './aktørid/aktørIdLookup';
import devAktørIdLookup from './aktørid/devAktørIdLookup';
import spadeClient from './adapters/spadeClient';
import devSpadeClient from './adapters/devSpadeClient';
import { Express } from 'express';
import { RedisClient } from 'redis';

const getDependencies = (app: Express) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies() : getProdDependencies(app);

const getDevDependencies = () => {
    return {
        person: {
            spleisClient: devSpleisClient,
            sparkelClient: devSparkelClient,
            aktørIdLookup: devAktørIdLookup,
            spadeClient: devSpadeClient,
            stsClient: devStsClient,
            onBehalfOf: devOnBehalfOf,
            cache: devRedisClient,
            config
        },
        payments: { vedtakClient: devVedtakClient, annulleringClient: devAnnulleringClient },
        redisClient: devRedisClient
    };
};

const getProdDependencies = (app: Express) => {
    const _redisClient: RedisClient = redisClient.init(config.redis);
    aktørIdLookup.init(stsClient, config.nav);
    const instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const _vedtakClient = vedtakClient(config.oidc, _onBehalfOf);
    const _annulleringClient = annulleringClient(config, _onBehalfOf);
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
        payments: { vedtakClient: _vedtakClient, annulleringClient: _annulleringClient },
        redisClient: _redisClient
    };
};

export default { getDependencies };
