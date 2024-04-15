import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { Handling, ModiaClient } from './modiaClient';

interface SetupOptions {
    modiaClient: ModiaClient;
}

export default ({ modiaClient }: SetupOptions) => {
    const router = Router();
    router.post('/', async (req: SpeilRequest, res: Response) => {
        try {
            await modiaClient.kallModia(Handling.velgBrukerIModia, req.session!.speilToken, req.session, req.body);
            res.sendStatus(200);
        } catch (error) {
            logger.warn(`Setting av person i modiacontext feilet: ${error}`);
            res.sendStatus(500);
        }
    });

    router.delete('/aktivbruker', async (req: SpeilRequest, res: Response) => {
        try {
            await modiaClient.kallModia(Handling.nullstillBruker, req.session!.speilToken, req.session);
            res.sendStatus(200);
        } catch (error) {
            logger.warn(`Nullstilling av person i modiacontext feilet: ${error}`);
            res.sendStatus(500);
        }
    });
    return router;
};
