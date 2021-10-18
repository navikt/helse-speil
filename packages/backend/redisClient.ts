import redis from 'redis';

import logger from './logging';
import { Helsesjekk, RedisConfig } from './types';

const init = (config: RedisConfig, helsesjekk: Helsesjekk) => {
    const redisClient = redis.createClient({
        host: config.host,
        port: config.port ? +config.port : undefined,
        password: config.password,
    });
    redisClient.on('connect', () => {
        logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
        helsesjekk.redis = true;
        logger.info('Redis client ready');
    });

    redisClient.on('error', (err) => {
        helsesjekk.redis = false;
        logger.error('Redis error: ', err);
    });

    return redisClient;
};

export default { init };
