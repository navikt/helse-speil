'use strict';

import { promisify } from 'util';
import { RedisClient } from 'redis';

export interface Storage {
    init: (client: RedisClient) => void;
    get: (key: string) => Promise<string>;
    assignCase: (key: string, value: string) => Promise<string>;
    getAll: (keys: string[]) => Promise<string[]>;
    unassignCase: (key: string) => Promise<number>;
}

const addPrefix = (id: string) => `tildeling-${id}`;

let redisClient: RedisClient | null = null;

const init = (client: RedisClient) => {
    redisClient = client;
};

const getAll = (keys: string[]) =>
    Promise.all(
        keys.map((oppgavereferanse) => get(oppgavereferanse).then((userId?: string) => ({ oppgavereferanse, userId })))
    );

const get = (key: string) => promisify(redisClient!.get).bind(redisClient)(addPrefix(key));

const assignmentsTtl = 3 * 24 * 60 * 60;
const assignCase = (key: string, value: any) =>
    promisify(redisClient!.set).bind(redisClient)(addPrefix(key), value, 'NX', 'EX', assignmentsTtl);

const unassignCase = (key: string) =>
    promisify(redisClient!.del)
        .bind(redisClient)(addPrefix(key))
        .then((value: number) => {
            if (value === 0) {
                throw Error(`No items to delete for key ${key}`);
            } else {
                return value;
            }
        });

const storage: Storage = {
    init,
    get,
    assignCase,
    getAll,
    unassignCase,
};

export default storage;
