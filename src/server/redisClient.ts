import redis from 'redis';
import { Helsesjekk, RedisConfig } from './types';

const init = (config: RedisConfig, helsesjekk: Helsesjekk) => {
    const redisClient = redis.createClient({
        host: config.host,
        port: config.port ? +config.port : undefined,
        password: config.password,
    });
    redisClient.on('connect', () => {
        console.log('Redis client connected');
    });

    redisClient.on('ready', () => {
        helsesjekk.redis = true;
        console.log('Redis client ready');
    });

    redisClient.on('error', (err) => {
        helsesjekk.redis = false;
        console.log('Redis error: ', err);
    });

    return redisClient;
};

export default { init };
