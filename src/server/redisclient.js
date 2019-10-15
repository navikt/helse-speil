const redis = require('redis');

const init = config => {
    const redisClient = redis.createClient({
        host: config.host,
        port: config.port,
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

module.exports = {
    init
};
