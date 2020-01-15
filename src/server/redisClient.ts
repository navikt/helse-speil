import redis from 'redis';
import { RedisConfig } from './types';

const init = (config: RedisConfig) => {
    const redisClient = redis.createClient({
        host: config.host,
        port: config.port ? +config.port : undefined,
        password: config.password
    });
    redisClient.on('connect', () => {
        console.log('Redis client connected');
    });
    redisClient.on('error', err => {
        console.log('Redis error: ', err);
    });

    return redisClient;
};

export default { init };
