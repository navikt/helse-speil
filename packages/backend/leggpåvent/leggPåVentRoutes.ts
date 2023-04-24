import { Response, Router } from 'express';

import { SpesialistClient } from '../http/spesialistClient';
import logger from '../logging';
import { NotatDTO, SpeilRequest } from '../types';

interface SetupOptions {
    spesialistClient: SpesialistClient;
}

export default ({ spesialistClient }: SetupOptions) => {
    const router = Router();

    router.post('/:oppgavereferanse', (req: SpeilRequest, res: Response) => {
        const body: NotatDTO = req.body;
        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                path: `/api/leggpaavent/${req.params.oppgavereferanse}`,
                body,
                method: 'post',
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under legg på vent: ${err}`);
                res.status(500).send('Feil under legg på vent');
            });
    });

    router.delete('/:oppgavereferanse', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                path: `/api/leggpaavent/${req.params.oppgavereferanse}`,
                method: 'delete',
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under fjern fra vent: ${err}`);
                res.status(500).send('Feil under fjern fra vent');
            });
    });

    return router;
};
