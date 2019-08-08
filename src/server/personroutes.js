'use strict';

const personLookup = require('./personlookup');

const setup = (app, config) => {
    personLookup.init(config);
    routes(app);
};

const routes = app => {
    app.get('/person/:aktorId', (req, res) => {
        const aktørId = req.params.aktorId;
        personLookup
            .hentPerson(aktørId)
            .then(person => {
                res.send(person);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
    });
};

module.exports = {
    setup: setup
};
