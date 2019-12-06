const expressSession = require('express-session');
const redisStore = require('connect-redis')(expressSession);
const logger = require('./logging');

const sessionStore = (config, redisClient) => {
    return process.env.NODE_ENV === 'development'
        ? createMemoryStoreSession(config)
        : createRedisSession(config, redisClient);
};

const createMemoryStoreSession = config => {
    logger.info('Setting up MemoryStore session store');

    return expressSession({
        secret: config.server.sessionSecret,
        saveUninitialized: false,
        resave: false
    });
};

const createRedisSession = (config, redisClient) => {
    logger.info('Setting up Redis session store');

    return expressSession({
        secret: config.server.sessionSecret,
        ttl: 43200, // 12 hours
        saveUninitialized: false,
        resave: false,
        store: new redisStore({
            client: redisClient
        })
    });
};

module.exports = {
    sessionStore
};
