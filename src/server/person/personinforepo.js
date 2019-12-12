'use strict';

const logger = require('../logging');

const timeToExpire = 34 * 60 * 60 * 1000;

const build = ({ personInfoLookup, cache }) => {
    return {
        getPersoninfo: getPersoninfo({ personInfoLookup, cache })
    };
};

const getPersoninfo = ({ personInfoLookup, cache }) => (req, res) => {
    const aktørId = req.params.aktorId;
    cache.get(`person-${aktørId}`, (err, personinfo) => {
        if (err) {
            logger.error('error fetching person info from cache', err);
            return res.sendStatus(500);
        }
        if (personinfo) {
            return res.send(JSON.parse(personinfo));
        } else {
            personInfoLookup
                .hentPersoninfo(aktørId)
                .then(personinfo => {
                    cache.setex(`person-${aktørId}`, timeToExpire, JSON.stringify(personinfo));
                    res.send(personinfo);
                })
                .catch(err => {
                    logger.error('error reading person info from sparkel', err);
                    res.sendStatus(500);
                });
        }
    });
};

module.exports = {
    build
};
