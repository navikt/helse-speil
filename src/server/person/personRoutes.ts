import { Request, Response, Router } from 'express';
import personinfoRepo from './personinfoRepo';
import personLookup from './personLookup';
import { PersonDependencies } from '../types';
import { PersonClient } from './personClient';
import logger from '../logging';
import { PersonoppdateringDTO } from '../../client/io/types';

const router = Router();

const setup = ({
    sparkelClient,
    aktørIdLookup,
    spesialistClient,
    personClient,
    stsClient,
    cache,
    config,
    onBehalfOf,
}: PersonDependencies) => {
    personinfoRepo.setup({ sparkelClient, aktørIdLookup, stsClient, cache });
    personLookup.setup({ spesialistClient, config, onBehalfOf });
    routes(router, personClient);
    return router;
};

const routes = (router: Router, personClient: PersonClient) => {
    router.get('/', personLookup.oppgaverForPeriode);
    router.get('/sok', personLookup.finnPerson);
    router.get('/:aktorId/info', personinfoRepo.getPersoninfo);

    router.post('/oppdater', (req: Request, res: Response) => {
        personClient
            .oppdaterPersoninfo(req.body as PersonoppdateringDTO, req.session!.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under post: ${err}`);
                res.status(500).send('Feil under post');
            });
    });
};

export default { setup };
