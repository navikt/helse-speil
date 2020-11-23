import { Response, Router } from 'express';
import { OverstyringClient } from './overstyringClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

interface SetupOptions {
    overstyringClient: OverstyringClient;
}

export default ({ overstyringClient }: SetupOptions) => {
    const router = Router();
    router.post('/overstyr/dager', (req: SpeilRequest, res: Response) => {
        overstyringClient
            .overstyrDager(req.body, req.session!.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under overstyring av dager: ${err}`);
                res.status(500).send('Feil under overstyring av dager');
            });
    });

    return router;
};
