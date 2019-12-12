const cache = {};

const get = (key, callback) => callback(null, cache[key]);

const set = (key, object, ...args) => {
    cache[key] = object;
    const callback = args[args.length - 1];
    callback(null, 'OK');
};

const setex = (key, ttl, object) => (cache[key] = object);

const del = (key, callback) => {
    delete cache[key];
    callback();
};

module.exports = {
    build: () => ({
        get,
        set,
        setex,
        del
    })
};
