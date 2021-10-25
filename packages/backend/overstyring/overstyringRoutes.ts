import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { OverstyringClient } from './overstyringClient';

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

    router.post('/overstyr/inntekt', (req: SpeilRequest, res: Response) => {
        overstyringClient
            .overstyrInntekt(req.body, req.session!.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under overstyring av inntekt: ${err}`);
                res.status(500).send('Feil under overstyring av inntekt');
            });
    });

    return router;
};
