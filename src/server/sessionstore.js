const expressSession = require('express-session');
const redisStore = require('connect-redis')(expressSession);

const sessionStore = (config, redisClient) => {
    return process.env.NODE_ENV === 'development'
        ? createMemoryStoreSession(config)
        : createRedisSession(config, redisClient);
};

const createMemoryStoreSession = config => {
    console.log('Setting up MemoryStore session store');

    return expressSession({ secret: config.server.sessionSecret });
};

const createRedisSession = (config, redisClient) => {
    console.log('Setting up Redis session store');

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
