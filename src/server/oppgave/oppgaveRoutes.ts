import { Response, Router } from 'express';
import { OppgaveClient } from './oppgaveClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

interface SetupOptions {
    oppgaveClient: OppgaveClient;
}

export default ({ oppgaveClient }: SetupOptions) => {
    const router = Router();

    router.post('/oppgave/vent', (req: SpeilRequest, res: Response) => {
        oppgaveClient
            .leggPåVent(req.session!.speilToken, req.params['aktorId'])
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under abonnering på aktør: ${err}`);
                res.status(500).send('Feil under abonnering på aktør');
            });
    });

    router.delete('/oppgave/vent', (req: SpeilRequest, res: Response) => {
        oppgaveClient
            .fjernPåVent(req.session!.speilToken, req.params['aktorId'])
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under abonnering på aktør: ${err}`);
                res.status(500).send('Feil under abonnering på aktør');
            });
    });

    return router;
};
