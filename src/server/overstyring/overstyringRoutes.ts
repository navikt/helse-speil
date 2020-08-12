import { Request, Response, Router } from 'express';
import { OverstyringDependencies } from '../types';
import { OverstyringClient } from './overstyringClient';
import logger from '../logging';

const router = Router();

const setup = ({ overstyringClient }: OverstyringDependencies) => {
    routes(router, overstyringClient);
    return router;
};

const routes = (router: Router, overstyringClient: OverstyringClient) => {
    router.post('/overstyr/dager', (req: Request, res: Response) => {
        overstyringClient
            .overstyrDager(req.body, req.session!.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under overstyring av dager: ${err}`);
                res.status(500).send('Feil under overstyring av dager');
            });
    });
};

export default { setup };
