const config = require('./config');
const redisclient = require('./redisclient');
const devRedisClient = require('./devredisclient');

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

const personinforepo = require('./person/personinforepo');
const personlookup = require('./person/personlookup');

const getDependencies = app =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app);

const getDevDependencies = app => {
    const instrumentation = instrumentationModule.setup(app);
    const onBehalfOf = onbehalfof.factory(config.oidc, instrumentation);
    personinforepo.setup({
        sparkelClient: devSparkelClient,
        aktørIdLookup: devAktørIdLookup,
        stsclient: devStsClient,
        cache: devRedisClient
    });
    personlookup.setup({
        aktørIdLookup: devAktørIdLookup,
        spadeClient: devSpadeClient,
        config,
        onBehalfOf
    });
    return {
        payments: { config, onBehalfOf },
        redisClient: devRedisClient
    };
};

const getProdDependencies = app => {
    const redisClient = redisclient.init({ config: config.redis });
    aktørIdLookup.init(stsclient, config.nav);
    const instrumentation = instrumentationModule.setup(app);
    const onBehalfOf = onbehalfof.factory(config.oidc, instrumentation);
    personinforepo.setup({
        sparkelClient,
        aktørIdLookup,
        stsclient,
        cache: redisClient
    });
    personlookup.setup({
        aktørIdLookup,
        spadeClient,
        config,
        onBehalfOf
    });
    return {
        payments: { config, onBehalfOf },
        redisClient
    };
};
module.exports = { getDependencies };
