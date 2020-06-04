import { Callback, RedisClient } from 'redis';

type Cache = { [key: string]: any };

const cache: Cache = {};

const get = (key: string, callback: Callback<string>): boolean => {
    callback(null, cache[key] || null);
    return true;
};

const set = (key: string, value: string, ...args: any[]): boolean => {
    const callback = args[args.length - 1];
    if (cache[key] !== undefined) {
        callback(null, 'exists');
        return false;
    }
    cache[key] = value;
    callback(null, 'OK');
    return true;
};

const setex = (key: string, _: number, value: string): boolean => {
    cache[key] = value;
    return true;
};

const del = (key: string, callback: Callback<string>): boolean => {
    callback(null, '');
    delete cache[key];
    return true;
};

// @ts-ignore
const devRedisClient: RedisClient = { get, set, setex, del };

export default devRedisClient;
