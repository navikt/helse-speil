'use strict';

const { promisify } = require('util');

const build = redisClient => {
    const get = key => promisify(redisClient.get).bind(redisClient)(key);

    const getAll = keys =>
        Promise.all(
            keys.map(key => get(key).then(value => ({ behovId: key, userId: value || undefined })))
        );

    const assignmentsTtl = 3 * 24 * 60 * 60;
    const assignCase = (key, value) =>
        promisify(redisClient.set).bind(redisClient)(key, value, 'NX', 'EX', assignmentsTtl);

    const unassignCase = key =>
        promisify(redisClient.del)
            .bind(redisClient)(key)
            .then(value => {
                if (value === 0) {
                    throw Error(`No items to delete for key ${key}`);
                }
                return value;
            });

    return {
        get,
        getAll,
        assignCase,
        unassignCase
    };
};

module.exports = {
    build
};
