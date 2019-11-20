const router = require('express').Router();
const personinforoutes = require('./personinforoutes');
const personlookup = require('./personlookup');

const setup = ({
    sparkelClient,
    aktørIdLookup,
    spadeClient,
    stsclient,
    cache,
    config,
    onBehalfOf
}) => {
    personinforoutes.setup({ sparkelClient, aktørIdLookup, stsclient, cache });
    personlookup.setup({ aktørIdLookup, spadeClient, config, onBehalfOf });
    routes(router);
    return router;
};
const routes = router => {
    router.get('/', personlookup.behovForPeriode);
    router.get('/sok', personlookup.sakSøk);
    router.get('/:aktorId/info', personinforoutes.getPerson);
};

module.exports = {
    setup
};
