import { Request, Response, Router } from 'express';
import { DummyClient } from './dummyClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

interface SetupOptions {
    dummyClient: DummyClient;
}

export default ({ dummyClient }: SetupOptions) => {
    const router = Router();
    router.post('/tildeling/:oppgaveref', (req: SpeilRequest, res: Response) => {
        dummyClient
            .postRequest(req.body, req.session!.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under post: ${err}`);
                res.status(500).send('Feil under post');
            });
    });

    return router;
};
