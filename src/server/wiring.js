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

const personinfolookupModule = require('./person/personinfolookup');
const personinforepoModule = require('./person/personinforepo');
const personlookupModule = require('./person/personlookup');

const getDependencies = app =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app);

const getDevDependencies = app => {
    const instrumentation = instrumentationModule.setup(app);
    const onBehalfOf = onbehalfof.factory(config.oidc, instrumentation);
    const personInfoLookup = personinfolookupModule.factory({
        sparkelClient: devSparkelClient,
        stsclient: devStsClient,
        aktørIdLookup: devAktørIdLookup
    });
    const personinforepo = personinforepoModule.factory({
        personInfoLookup,
        cache: devRedisClient
    });
    const personlookup = personlookupModule.factory({
        aktørIdLookup: devAktørIdLookup,
        spadeClient: devSpadeClient,
        config,
        onBehalfOf
    });
    return {
        payments: { config, onBehalfOf },
        person: { personlookup, personinforepo },
        redisClient: devRedisClient
    };
};

const getProdDependencies = app => {
    const redisClient = redisclient.init({ config: config.redis });
    aktørIdLookup.init(stsclient, config.nav);
    const instrumentation = instrumentationModule.setup(app);
    const onBehalfOf = onbehalfof.factory(config.oidc, instrumentation);
    const personInfoLookup = personinfolookupModule.factory({
        sparkelClient,
        stsclient,
        aktørIdLookup
    });
    const personinforepo = personinforepoModule.factory({
        personInfoLookup,
        cache: redisClient
    });
    const personlookup = personlookupModule.factory({
        aktørIdLookup,
        spadeClient,
        config,
        onBehalfOf
    });
    return {
        payments: { config, onBehalfOf },
        person: { personlookup, personinforepo },
        redisClient
    };
};
module.exports = { getDependencies };
