import { Response, Router } from 'express';

import logger from '../logging';
import { PersonDependencies, SpeilRequest } from '../types';
import { PersonClient, PersonoppdateringOptions } from './personClient';
import personLookup from './personLookup';

const router = Router();

const setup = ({ spesialistClient, personClient, config, onBehalfOf }: PersonDependencies) => {
    personLookup.setup({ spesialistClient, config, onBehalfOf });
    routes(router, personClient);
    return router;
};

const routes = (router: Router, personClient: PersonClient) => {
    router.get('/', personLookup.oppgaverForPeriode);
    router.get('/sok', personLookup.finnPerson);

    router.post('/oppdater', (req: SpeilRequest, res: Response) => {
        personClient
            .oppdaterPersoninfo(req.body as PersonoppdateringOptions, req.session.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under post: ${err}`);
                res.status(500).send('Feil under post');
            });
    });
};

export default { setup };
