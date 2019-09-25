const expressSession = require('express-session');
const redisStore = require('connect-redis')(expressSession);

const sessionStore = config => {
    return process.env.NODE_ENV === 'development'
        ? createMemoryStoreSession(config)
        : createRedisSession(config);
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
        store: new redisStore({
            client: redisClient
        })
    });
};

module.exports = {
    sessionStore
};
