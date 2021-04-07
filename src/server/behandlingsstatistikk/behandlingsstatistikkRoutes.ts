import { Response, Router } from 'express';
import { SpeilRequest } from '../types';
import logger from '../logging';
import { SpesialistClient } from '../person/spesialistClient';

export default (spesialistClient: SpesialistClient) => {
    const router = Router();
    router.get('/behandlingsstatistikk', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .hentBehandlingsstatistikk(req.session!.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under henting av behandlingsstatistikk: ${err}`);
                res.status(err.statusCode).send('Feil under henting av behandlingsstatistikk');
            });
    });

    return router;
};
