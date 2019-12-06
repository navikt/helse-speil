const config = require('./config');
const redisclient = require(prod ? './redisclient' : './devredisclient');

const instrumentationModule = require('./instrumentation');
const onbehalfof = require('./auth/onbehalfof');

const spadeClient = require(prod ? './adapters/spadeClient' : './adapters/devSpadeClient');
const aktørIdLookup = require(prod ? './aktørid/aktøridlookup' : './aktørid/devAktørIdLookup');
const sparkelClient = require(prod ? './adapters/sparkelClient' : './adapters/devSparkelClient');
const stsclient = require(prod ? './auth/stsclient' : './auth/devStsClient');

const personinfolookupModule = require('./person/personinfolookup');
const personinforepoModule = require('./person/personinforepo');
const personlookupModule = require('./person/personlookup');

const prod = process.env.NODE_ENV !== 'development';

const getDependencies = app => {
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
