const router = require('express').Router();

const setup = ({ personlookup, personinforepo }) => {
    router.get('/', personlookup.behovForPeriode);
    router.get('/sok', personlookup.sakSøk);
    router.get('/:aktorId/info', personinforepo.getPersoninfo);
    return router;
};

module.exports = {
    setup
};
