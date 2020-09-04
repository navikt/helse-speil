'use strict';

import { promisify } from 'util';
import { RedisClient } from 'redis';

export interface Storage {
    init: (client: RedisClient) => void;
    get: (key: string) => Promise<string>;
    assignCase: (key: string, value: string) => Promise<string>;
    getAll: (keys: string[]) => Promise<Tildeling[]>;
    unassignCase: (key: string) => Promise<boolean>;
}

export interface Tildeling {
    oppgavereferanse: string;
    userId: string;
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
        .then((value: number) => value !== 0);

const storage: Storage = {
    init,
    get,
    assignCase,
    getAll,
    unassignCase,
};

export default storage;
