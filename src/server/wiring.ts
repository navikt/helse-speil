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
import vedtakClient from './payment/vedtakClient';
import devVedtakClient from './payment/devVedtakClient';
import annulleringClient from './payment/annulleringClient';
import devAnnulleringClient from './payment/devAnnulleringClient';
import aktørIdLookup from './aktørid/aktørIdLookup';
import devAktørIdLookup from './aktørid/devAktørIdLookup';
import spesialistClient from './person/spesialistClient';
import devSpesialistClient from './adapters/devSpesialistClient';
import overstyringClient from './overstyring/overstyringClient';
import devOverstyringClient from './overstyring/devOverstyringClient';

import { Express } from 'express';
import { RedisClient } from 'redis';

const getDependencies = (app: Express) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies() : getProdDependencies(app);

const getDevDependencies = () => {
    return {
        person: {
            sparkelClient: devSparkelClient,
            aktørIdLookup: devAktørIdLookup,
            spesialistClient: devSpesialistClient,
            stsClient: devStsClient,
            onBehalfOf: devOnBehalfOf,
            cache: devRedisClient,
            config,
        },
        payments: { vedtakClient: devVedtakClient, annulleringClient: devAnnulleringClient },
        redisClient: devRedisClient,
        overstyring: { overstyringClient: devOverstyringClient },
    };
};

const getProdDependencies = (app: Express) => {
    const _redisClient: RedisClient = redisClient.init(config.redis);
    stsClient.init(config.nav);
    aktørIdLookup.init(stsClient, config.nav);
    const instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const _vedtakClient = vedtakClient(config.oidc, _onBehalfOf);
    const _overstyringClient = overstyringClient(config.oidc, _onBehalfOf);
    const _annulleringClient = annulleringClient(config, _onBehalfOf);
    return {
        person: {
            sparkelClient,
            aktørIdLookup,
            spesialistClient,
            stsClient,
            onBehalfOf: _onBehalfOf,
            cache: _redisClient,
            config,
        },
        payments: { vedtakClient: _vedtakClient, annulleringClient: _annulleringClient },
        redisClient: _redisClient,
        overstyring: { overstyringClient: _overstyringClient },
    };
};

export default { getDependencies };
