import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { OpptegnelseClient } from './opptegnelseClient';

interface SetupOptions {
    opptegnelseClient: OpptegnelseClient;
}

export default ({ opptegnelseClient }: SetupOptions) => {
    const router = Router();

    router.post('/abonner/:aktorId', (req: SpeilRequest, res: Response) => {
        opptegnelseClient
            .abonnerPåAktør(req.session!.speilToken, req.params['aktorId'])
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
        opptegnelseClient
            .getAlleOpptegnelser(req.session!.speilToken)
            .then((it) => res.status(200).send(it.body))
            .catch((err) => {
                logger.warn(`Feil under henting av opptegnelser (se sikkerLogg for detaljer)`);
                logger.sikker.warn(`Feil under henting av opptegnelser: ${err}`, { error: err });
                res.status(500).send('Feil under henting av opptegnelser');
            });
    });

    router.get('/hent/:sisteSekvensId', (req: SpeilRequest, res: Response) => {
        opptegnelseClient
            .getOpptegnelser(req.session!.speilToken, Number(req.params['sisteSekvensId']))
            .then((it) => res.status(200).send(it.body))
            .catch((err) => {
                logger.warn(`Feil under henting av opptegnelser med sisteSekvensId (se sikkerLogg for detaljer)`);
                logger.sikker.warn(`Feil under henting av opptegnelser med sisteSekvensId: ${err}`, { error: err });
                res.status(500).send('Feil under henting av opptegnelser med sisteSekvensId');
            });
    });

    return router;
};
