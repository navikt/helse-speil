import { Request, Response, Router } from 'express';

import { getToken } from '@navikt/oasis';

import logger from '../logging';
import { Handling, ModiaClient } from './modiaClient';

interface SetupOptions {
    modiaClient: ModiaClient;
}

export default ({ modiaClient }: SetupOptions) => {
    const router = Router();
    router.post('/', async (req: Request, res: Response) => {
        const token = getToken(req);
        if (!token) {
            res.sendStatus(401);
            return;
        }
        try {
            await modiaClient.kallModia(Handling.velgBrukerIModia, token, req.body);
            res.sendStatus(200);
        } catch (error) {
            logger.warn(`Setting av person i modiacontext feilet: ${error}`);
            res.sendStatus(500);
        }
    });

    router.delete('/aktivbruker', async (req: Request, res: Response) => {
        const token = getToken(req);
        if (!token) {
            res.sendStatus(401);
            return;
        }
        try {
            await modiaClient.kallModia(Handling.nullstillBruker, token);
            res.sendStatus(200);
        } catch (error) {
            logger.warn(`Nullstilling av person i modiacontext feilet: ${error}`);
            res.sendStatus(500);
        }
    });
    return router;
};
