const config = require('./config');
const redisclient = require('./redisclient');

const instrumentationModule = require('./instrumentation');
const stsclient = require('./auth/stsclient');
const devStsClient = require('./auth/devStsClient');
const onbehalfof = require('./auth/onbehalfof');
const sparkelClient = require('./adapters/sparkelClient');
const devSparkelClient = require('./adapters/devSparkelClient');
const aktørIdLookup = require('./aktørid/aktøridlookup');
const devAktørIdLookup = require('./aktørid/devAktørIdLookup');
const spadeClient = require('./adapters/spadeClient');
const devSpadeClient = require('./adapters/devSpadeClient');

const getDependencies = app =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app);

const getDevDependencies = app => {
    const redisClient = redisclient.init({ config: config.redis });
    const instrumentation = instrumentationModule.setup(app);
    const onBehalfOf = onbehalfof.factory(config.oidc, instrumentation);
    return {
        person: {
            sparkelClient: devSparkelClient,
            aktørIdLookup: devAktørIdLookup,
            spadeClient: devSpadeClient,
            stsclient: devStsClient,
            onBehalfOf,
            cache: redisClient,
            config
        },
        payments: { config: config, onBehalfOf },
        redisClient
    };
};

const getProdDependencies = app => {
    const redisClient = redisclient.init({ config: config.redis });
    aktørIdLookup.init(stsclient, config.nav);
    const instrumentation = instrumentationModule.setup(app);
    const onBehalfOf = onbehalfof.factory(config.oidc, instrumentation);
    return {
        person: {
            sparkelClient,
            aktørIdLookup,
            spadeClient,
            stsclient,
            onBehalfOf,
            cache: redisClient,
            config
        },
        payments: { config: config, onBehalfOf },
        redisClient
    };
};
module.exports = { getDependencies };
