const router = require('express').Router();
const personinforepo = require('./personinforepo');
const personlookup = require('./personlookup');

const setup = () => {
    router.get('/', personlookup.behovForPeriode);
    router.get('/sok', personlookup.sakSøk);
    router.get('/:aktorId/info', personinforepo.getPersoninfo);
    return router;
};

module.exports = {
    setup
};
