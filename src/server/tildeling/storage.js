'use strict';

const { promisify } = require('util');
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

const get = key => promisify(redisClient.get).bind(redisClient)(key);

const assignmentsTtl = 3 * 24 * 60 * 60;
const assignCase = (key, value) =>
    promisify(redisClient.set).bind(redisClient)(key, value, 'NX', 'EX', assignmentsTtl);

const unassignCase = key => {
    return new Promise((resolve, reject) => {
        redisClient.del(key, (err, val) => {
            if (err) {
                reject(err);
            } else if (val === 0) {
                reject(Error(`No items to delete for key ${key}`));
            } else {
                resolve();
            }
        });
    });
};

module.exports = {
    init,
    get,
    assignCase,
    getAll,
    unassignCase
};
