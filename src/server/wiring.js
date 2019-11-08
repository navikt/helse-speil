const config = require('./config');
const redisclient = require('./redisclient');

const instrumentation = require('./instrumentation');
const stsclient = require('./auth/stsclient');
const devStsClient = require('./auth/devStsClient');
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
    return {
        feedback: { config: config.s3, instrumentation: instrumentation.setup(app) },
        person: {
            sparkelClient: devSparkelClient,
            aktørIdLookup: devAktørIdLookup,
            spadeClient: devSpadeClient,
            stsclient: devStsClient,
            cache: redisClient,
            config: config.nav
        },
        payments: { config: config.nav },
        redisClient
    };
};

const getProdDependencies = app => {
    const redisClient = redisclient.init({ config: config.redis });
    aktørIdLookup.init(stsclient, config.nav);
    return {
        feedback: { config: config.s3, instrumentation: instrumentation.setup(app) },
        person: {
            sparkelClient,
            aktørIdLookup,
            spadeClient,
            stsclient,
            cache: redisClient,
            config: config.nav
        },
        payments: { config: config.nav },
        redisClient
    };
};
module.exports = { getDependencies };
