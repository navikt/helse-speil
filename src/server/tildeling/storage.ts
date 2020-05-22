'use strict';

import { promisify } from 'util';
import { RedisClient } from 'redis';

let redisClient: RedisClient | null = null;

const init = (client: RedisClient) => {
    redisClient = client;
};

const getAll = (keys: string[]) =>
    Promise.all(keys.map((behovId) => get(behovId).then((userId?: string) => ({ behovId, userId }))));

const get = (key: string) => promisify(redisClient!.get).bind(redisClient)(key);

const assignmentsTtl = 3 * 24 * 60 * 60;
const assignCase = (key: string, value: any) =>
    promisify(redisClient!.set).bind(redisClient)(key, value, 'NX', 'EX', assignmentsTtl);

const unassignCase = (key: string) =>
    promisify(redisClient!.del)
        .bind(redisClient)(key)
        .then((value: any) => {
            if (value === 0) {
                throw Error(`No items to delete for key ${key}`);
            } else {
                return value;
            }
        });

export default {
    init,
    get,
    assignCase,
    getAll,
    unassignCase,
};
