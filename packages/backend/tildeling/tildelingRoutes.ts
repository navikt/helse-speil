import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { HttpMethod, SpesialistClient } from './spesialistClient';

export default (spesialistClient: SpesialistClient) => {
    const router = Router();
    router.post('/:oppgavereferanse', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                speilToken: req.session.speilToken,
                path: `/api/tildeling/${req.params['oppgavereferanse']}`,
                method: HttpMethod.POST,
            })
            .then(() => res.sendStatus(200))
            .catch((ex) => {
                if (ex.statusCode === 409) {
                    logger.warn(`Oppgaven er allerede tildelt. Svar fra spesialist: ${JSON.stringify(ex.error)}`);
                } else {
                    logger.error(`Feil under tildeling: ${ex}`);
                }
                res.status(ex.statusCode).send(ex.error);
            });
    });

    router.delete('/:oppgavereferanse', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                speilToken: req.session.speilToken,
                path: `/api/tildeling/${req.params['oppgavereferanse']}`,
                method: HttpMethod.DELETE,
            })
            .then(() => res.sendStatus(200))
            .catch((ex) => {
                logger.error(`Feil under fjerning av tildeling: ${ex}`);
                res.status(ex.statusCode).send('Feil under tildeling');
            });
    });

    return router;
};
