import { Response, Router } from 'express';

import { HttpMethod, SpesialistClient } from '../http/spesialistClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

interface SetupOptions {
    spesialistClient: SpesialistClient;
}

export default ({ spesialistClient }: SetupOptions) => {
    const router = Router();

    router.post('/abonner/:aktorId', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                session: req.session,
                path: `/api/opptegnelse/abonner/${req.params['aktorId']}`,
                method: HttpMethod.POST,
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                if (err?.cause?.code === 'ECONNRESET')
                    logger.error(`Feil under abonnering på aktør, ECONNRESET mot ${err.cause.host}`);
                else {
                    logger.error(`Feil under abonnering på aktør (se sikkerLogg for detaljer)`);
                    logger.sikker.error(`Feil under abonnering på aktør: ${err}`, { error: err });
                }
                res.status(500).send('Feil under abonnering på aktør');
            });
    });

    router.get('/hent', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                session: req.session,
                path: `api/opptegnelse/hent`,
                method: HttpMethod.GET,
            })
            .then((it) => res.status(200).send(it.body))
            .catch((err) => {
                logger.warn(`Feil under henting av opptegnelser (se sikkerLogg for detaljer)`);
                logger.sikker.warn(`Feil under henting av opptegnelser: ${err}`, { error: err });
                res.status(500).send('Feil under henting av opptegnelser');
            });
    });

    router.get('/hent/:sisteSekvensId', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                speilToken: req.session!.speilToken,
                session: req.session,
                path: `/api/opptegnelse/hent/${Number(req.params['sisteSekvensId'])}`,
                method: HttpMethod.GET,
            })
            .then((it) => res.status(200).send(it.body))
            .catch((err) => {
                logger.warn(`Feil under henting av opptegnelser med sisteSekvensId (se sikkerLogg for detaljer)`);
                logger.sikker.warn(`Feil under henting av opptegnelser med sisteSekvensId: ${err}`, { error: err });
                res.status(500).send('Feil under henting av opptegnelser med sisteSekvensId');
            });
    });

    return router;
};
