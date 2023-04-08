import { Response, Router } from 'express';

import logger from '../logging';
import { PersonDependencies, SpeilRequest } from '../types';
import { PersonClient, PersonoppdateringOptions } from './personClient';

const router = Router();

const setup = ({ personClient, config, onBehalfOf }: PersonDependencies) => {
    routes(router, personClient);
    return router;
};

const routes = (router: Router, personClient: PersonClient) => {
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
