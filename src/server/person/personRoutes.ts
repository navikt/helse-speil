import { Router } from 'express';
import personinfoRepo from './personinfoRepo';
import personLookup from './personLookup';
import { PersonDependencies } from '../types';

const router = Router();

const setup = ({
    sparkelClient,
    aktørIdLookup,
    spesialistClient,
    storage,
    stsClient,
    cache,
    config,
    onBehalfOf,
}: PersonDependencies) => {
    personinfoRepo.setup({ sparkelClient, aktørIdLookup, stsClient, cache });
    personLookup.setup({ aktørIdLookup, spesialistClient, storage, config, onBehalfOf });
    routes(router);
    return router;
};

const routes = (router: Router) => {
    router.get('/', personLookup.behovForPeriode);
    router.get('/sok', personLookup.finnPerson);
    router.get('/:aktorId/info', personinfoRepo.getPersoninfo);
};

export default { setup };
