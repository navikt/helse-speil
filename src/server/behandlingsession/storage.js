'use strict';

const redis = require('redis');

let redisClient = null;

const init = async config => {
    redisClient = redis.createClient({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password
    });
    redisClient.on('error', err => {
        console.log('Redis error: ', err);
    });

    return redisClient;
};

const getAll = async keys => {
    const keyValuePairs = keys.map(
        key =>
            new Promise((resolve, reject) =>
                redisClient.get(key, (err, value) => {
                    if (err) {
                        reject(err);
                    }
                    if (value) {
                        resolve({ behandlingsId: key, userId: value });
                    } else {
                        resolve({ behandlingsId: key, userId: undefined });
                    }
                })
            )
    );

    return Promise.all(keyValuePairs);
};

const get = async key => {
    redisClient.get(key, (err, val) => {
        if (err) {
            throw err;
        }
        return val;
    });
};

const set = async (key, value) => {
    const secondsInThreeDays = 267913;

    redisClient
        .multi()
        .setnx(key, value)
        .expire(key, secondsInThreeDays)
        .exec((err, val) => {
            if (err) {
                throw err;
            }
            return val;
        });
};

const del = async key => {
    redisClient.del(key, (err, val) => {
        if (err) {
            throw err;
        }
        return val;
    });
};

module.exports = {
    init,
    get,
    set,
    getAll,
    del
};
