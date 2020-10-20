import { Request, Response, Router } from 'express';
import { TildelingClient } from './tildelingClient';
import logger from '../logging';

interface SetupOptions {
    tildelingClient: TildelingClient;
}

export default ({ tildelingClient }: SetupOptions) => {
    const router = Router();
    router.post('/', (req: Request, res: Response) => {
        tildelingClient
            .postTildeling(req.body, req.session!.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under tildeling: ${err}`);
                res.status(500).send('Feil under tildeling');
            });
    });

    return router;
};
