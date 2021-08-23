import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { TildelingClient } from './tildelingClient';

interface SetupOptions {
    tildelingClient: TildelingClient;
}

export default ({ tildelingClient }: SetupOptions) => {
    const router = Router();
    router.post('/:oppgavereferanse', (req: SpeilRequest, res: Response) => {
        tildelingClient
            .postTildeling({ oppgavereferanse: req.params['oppgavereferanse'] }, req.session.speilToken)
            .then(() => res.sendStatus(200))
            .catch((ex) => {
                if (ex.statusCode === 409) {
                    logger.warning(`Oppgaven er allerede tildelt. Svar fra spesialist: ${JSON.stringify(ex.error)}`);
                } else {
                    logger.error(`Feil under tildeling: ${ex}`);
                }
                res.status(ex.statusCode).send(ex.error);
            });
    });

    router.delete('/:oppgavereferanse', (req: SpeilRequest, res: Response) => {
        tildelingClient
            .fjernTildeling({ oppgavereferanse: req.params['oppgavereferanse'] }, req.session.speilToken)
            .then(() => res.sendStatus(200))
            .catch((ex) => {
                logger.error(`Feil under fjerning av tildeling: ${ex}`);
                res.status(ex.statusCode).send('Feil under tildeling');
            });
    });

    return router;
};
