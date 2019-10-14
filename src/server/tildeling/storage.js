'use strict';

const { promisify } = require('util');
let redisClient = null;

const init = client => {
    redisClient = client;
};

const getAll = keys =>
    Promise.all(
        keys.map(key =>
            get(key).then(value => ({ behandlingsId: key, userId: value || undefined }))
        )
    );

const get = key => promisify(redisClient.get).bind(redisClient)(key);

const assignmentsTtl = 3 * 24 * 60 * 60;
const assignCase = (key, value) =>
    promisify(redisClient.set).bind(redisClient)(key, value, 'NX', 'EX', assignmentsTtl);

const unassignCase = key =>
    promisify(redisClient.del)
        .bind(redisClient)(key)
        .then(value => {
            if (value === 0) {
                throw Error(`No items to delete for key ${key}`);
            } else {
                return value;
            }
        });

module.exports = {
    init,
    get,
    assignCase,
    getAll,
    unassignCase
};
