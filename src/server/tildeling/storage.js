'use strict';

let redisClient = null;

const init = client => {
    redisClient = client;
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
    const secondsInThreeDays = 259200;
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
