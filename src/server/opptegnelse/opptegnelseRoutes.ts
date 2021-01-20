import { Response, Router } from 'express';
import { OpptegnelseClient } from './opptegnelseClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

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
                logger.error(`Feil under abonnering på aktør: ${err}`);
                res.status(500).send('Feil under abonnering på aktør');
            });
    });

    router.get('/hent', (req: SpeilRequest, res: Response) => {
        opptegnelseClient
            .getAlleOpptegnelser(req.session!.speilToken)
            .then((it) => res.status(200).send(it))
            .catch((err) => {
                logger.error(`Feil under henting av opptegnelser: ${err}`);
                res.status(500).send('Feil under henting av opptegnelser');
            });
    });

    router.get('/hent/:sisteSekvensId', (req: SpeilRequest, res: Response) => {
        opptegnelseClient
            .getOpptegnelser(req.session!.speilToken, Number(req.params['sisteSekvensId']))
            .then((it) => res.status(200).send(it))
            .catch((err) => {
                logger.error(`Feil under henting av opptegnelser med sisteSekvensId: ${err}`);
                res.status(500).send('Feil under henting av opptegnelser med sisteSekvensId');
            });
    });

    return router;
};
