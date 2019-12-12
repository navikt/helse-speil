const config = require('./config');
const redisclientFactory = require(prod ? './redisclient' : './devredisclient');

const instrumentationFactory = require('./instrumentation');
const onbehalfofFactory = require('./auth/onbehalfof');

const spadeClient = require(prod ? './adapters/spadeClient' : './adapters/devSpadeClient');
const aktørIdLookup = require(prod ? './aktørid/aktøridlookup' : './aktørid/devAktørIdLookup');
const sparkelClient = require(prod ? './adapters/sparkelClient' : './adapters/devSparkelClient');
const stsclient = require(prod ? './auth/stsclient' : './auth/devStsClient');

const personinfolookupFactory = require('./person/personinfolookup');
const personinforepoFactory = require('./person/personinforepo');
const personlookupFactory = require('./person/personlookup');
const storageFactory = require('./tildeling/storage');

const prod = process.env.NODE_ENV !== 'development';

const getDependencies = app => {
    const redisClient = redisclientFactory.build({ config: config.redis });
    const tildelingStorage = storageFactory.build(redisClient);
    aktørIdLookup.init(stsclient, config.nav);
    const instrumentation = instrumentationFactory.build(app);
    const onBehalfOf = onbehalfofFactory.build(config.oidc, instrumentation);
    const personInfoLookup = personinfolookupFactory.build({
        sparkelClient,
        stsclient,
        aktørIdLookup
    });
    const personinforepo = personinforepoFactory.build({
        personInfoLookup,
        cache: redisClient
    });
    const personlookup = personlookupFactory.build({
        aktørIdLookup,
        spadeClient,
        config,
        onBehalfOf
    });
    return {
        payments: { config, onBehalfOf },
        person: { personlookup, personinforepo },
        tildeling: { storage: tildelingStorage },
        redisClient
    };
};

module.exports = { getDependencies };
