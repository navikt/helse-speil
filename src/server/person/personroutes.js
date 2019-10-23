const router = require('express').Router();
const personinforoutes = require('./personinforoutes');
const personlookup = require('./personlookup');

const setup = ({ stsclient, cache, config }) => {
    personinforoutes.setup({ stsclient, cache });
    personlookup.setup({ stsclient, config });
    routes(router);
    return router;
};
const routes = router => {
    router.get('/', personlookup.behandlingerForPeriod);
    router.get('/sok', personlookup.personSøk);
    router.get('/:aktorId/info', personinforoutes.getPerson);
};

module.exports = {
    setup
};
