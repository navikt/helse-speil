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
            .catch((err) => {
                if (err.statusCode === 409) {
                    logger.warning(`Oppgaven er allerede tildelt: ${err}`);
                } else {
                    logger.error(`Feil under tildeling: ${err}`);
                }
                if (err.feilkode) {
                    res.status(err.feilkode).send(err);
                } else {
                    res.status(err.statusCode).send('Feil under tildeling');
                }
            });
    });

    router.delete('/:oppgavereferanse', (req: SpeilRequest, res: Response) => {
        tildelingClient
            .fjernTildeling({ oppgavereferanse: req.params['oppgavereferanse'] }, req.session.speilToken)
            .then(() => res.sendStatus(200))
            .catch((err) => {
                if (err.feilkode) {
                    res.status(err.feilkode).send(err);
                } else {
                    res.status(err.statusCode).send('Feil under tildeling');
                }
            });
    });

    return router;
};
