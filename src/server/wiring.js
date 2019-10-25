const config = require('./config');
const redisclient = require('./redisclient');

const instrumentation = require('./instrumentation');
const stsclient = require('./auth/stsclient');

const getDependencies = app => {
    const redisClient = redisclient.init({ config: config.redis });
    return {
        feedback: { config: config.s3, instrumentation: instrumentation.setup(app) },
        person: { stsclient, cache: redisClient, config: config.nav },
        payments: { config: config.nav },
        redisClient
    };
};
module.exports = { getDependencies };
