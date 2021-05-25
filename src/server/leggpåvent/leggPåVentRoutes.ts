import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { LeggPåVentClient } from './leggPåVentClient';

interface SetupOptions {
    leggPåVentClient: LeggPåVentClient;
}

export default ({ leggPåVentClient }: SetupOptions) => {
    const router = Router();

    router.post('/:oppgaveReferanse', (req: SpeilRequest, res: Response) => {
        leggPåVentClient
            .leggPåVent(req.session!.speilToken, req.params.oppgaveReferanse)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under legg på vent: ${err}`);
                res.status(500).send('Feil under legg på vent');
            });
    });

    router.delete('/:oppgaveReferanse', (req: SpeilRequest, res: Response) => {
        leggPåVentClient
            .fjernPåVent(req.session!.speilToken, req.params.oppgaveReferanse)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under fjern fra vent: ${err}`);
                res.status(500).send('Feil under fjern fra vent');
            });
    });

    return router;
};
