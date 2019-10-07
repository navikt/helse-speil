const expressSession = require('express-session');
const redisStore = require('connect-redis')(expressSession);
const redis = require('redis');
const logger = require('./logging');

const sessionStore = config => {
    return process.env.NODE_ENV === 'development'
        ? createMemoryStoreSession(config)
        : createRedisSession(config);
};

const createMemoryStoreSession = config => {
    logger.info('Setting up MemoryStore session store');

    return expressSession({ secret: config.server.sessionSecret });
};

const createRedisSession = config => {
    logger.info('Setting up Redis session store');

    return expressSession({
        secret: config.server.sessionSecret,
        ttl: 43200, // 12 hours
        saveUninitialized: false,
        resave: false,
        store: new redisStore({
            client: redis.createClient({
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.password
            })
        })
    });
};

module.exports = {
    sessionStore
};
