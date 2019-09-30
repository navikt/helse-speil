'use strict';

const personLookup = require('./personlookup');
const personMapping = require('./personmapping');
const router = require('express').Router();

const setup = stsclient => {
    personLookup.init(stsclient);
    routes(router);
    return router;
};

const routes = app => {
    app.get('/:aktorId', (req, res) => {
        if (process.env.NODE_ENV === 'development') {
            const response =
                req.params.aktorId === '10000000000001'
                    ? { navn: 'Kong Harald', kjønn: 'mann' }
                    : { navn: 'Dronning Sonja', kjønn: 'kvinne' };
            res.send(response);
            return;
        }
        const aktørId = req.params.aktorId;
        personLookup
            .hentPerson(aktørId)
            .then(person => {
                res.send(personMapping.map(person));
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
    });
};

module.exports = {
    setup
};
