import { RedisClientType, createClient } from 'redis';

import logger from './logging';
import { Helsesjekk, RedisConfig } from './types';

// Aiven Redis timer ut idle connections etter fem minutter, det gidder vi vel ikke.
const pingInterval = 1000 * 60 * 4;

const init = (config: RedisConfig, helsesjekk: Helsesjekk) => {
    const redisClient: RedisClientType = createClient({
        url: config.url,
        username: config.username,
        password: config.password,
        pingInterval,
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

    redisClient.connect().catch((err) => logger.error(err));

    return redisClient;
};

export default { init };
