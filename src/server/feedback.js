'use strict';

const storage = require('./storage');

const setup = (app, config) => {
    return new Promise((resolve, reject) => {
        storage
            .init(config.s3url, config.s3AccessKey, config.s3SecretKey)
            .then(() => {
                routes(app);
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    });
};

const routes = app => {
    app.get('/feedback', (req, res) => {
        res.send('yepp!');
    });
};

module.exports = {
    setup: setup
};
