'use strict';

const personInfoLookup = require('./personinfolookup');
const personMapping = require('./personinfomapping');
const aktøridlookup = require('../aktørid/aktøridlookup');
const logger = require('../logging');

const timeToExpire = 34 * 60 * 60 * 1000;
let cache;
const setup = ({ stsclient, cache: cacheParam }) => {
    personInfoLookup.init(stsclient, aktøridlookup);
    cache = cacheParam;
};

const getPerson = (req, res) => {
    return process.env.NODE_ENV === 'development' ? _devGetPerson(req, res) : _getPerson(req, res);
};

const _getPerson = (req, res) => {
    const aktørId = req.params.aktorId;
    cache.get(`person-${aktørId}`, (err, personinfo) => {
        if (err) {
            logger.error(err);
            return res.sendStatus(500);
        }
        if (personinfo) {
            return res.send(JSON.parse(personinfo));
        } else {
            personInfoLookup
                .hentPerson(aktørId)
                .then(person => {
                    const personinfo = personMapping.map(person);
                    cache.setex(`person-${aktørId}`, timeToExpire, JSON.stringify(personinfo));
                    res.send(personinfo);
                })
                .catch(err => {
                    logger.error(err);
                    res.sendStatus(500);
                });
        }
    });
};

const _devGetPerson = (req, res) => {
    const response =
        req.params.aktorId === '10000000000001'
            ? { navn: 'Kong Harald', kjønn: 'mann', fnr: '98765432100' }
            : { navn: 'Dronning Sonja', kjønn: 'kvinne', fnr: '12345678900' };
    res.send(response);
};

module.exports = {
    setup,
    getPerson
};
