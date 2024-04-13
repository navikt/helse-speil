import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { ModiaClient } from './modiaClient';

interface SetupOptions {
    modiaClient: ModiaClient;
}

export default ({ modiaClient }: SetupOptions) => {
    const router = Router();
    router.post('/', async (req: SpeilRequest, res: Response) => {
        try {
            await modiaClient.postModiaContext(req.session!.speilToken, req.session, req.body);
            res.sendStatus(200);
        } catch (error) {
            logger.warn(`Setting av person i modiacontext feilet: ${error}`);
            res.sendStatus(500);
        }
    });
    return router;
};
