import RedisStore from 'connect-redis';
import expressSession from 'express-session';
import { RedisClientType } from 'redis';

import logger from './logging';
import { AppConfig } from './types';

const createMemoryStoreSession = (config: AppConfig) => {
    logger.info('Setting up MemoryStore session store');

    return expressSession({
        secret: config.server.sessionSecret!,
        saveUninitialized: false,
        resave: false,
    });
};

const createRedisSession = (config: AppConfig, redisClient: RedisClientType) => {
    logger.info('Setting up Redis session store');

    return expressSession({
        secret: config.server.sessionSecret!,
        saveUninitialized: false,
        resave: false,
        store: new RedisStore({
            client: redisClient,
            ttl: 43200, // 12 hours
        }),
    });
};

export { createMemoryStoreSession, createRedisSession };
