import { Response, Router } from 'express';

import { SpesialistClient } from '../http/spesialistClient';
import logger from '../logging';
import { SpeilRequest } from '../types';

export default (spesialistClient: SpesialistClient) => {
    const router = Router();
    router.post('/overstyr/dager', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                body: req.body,
                speilToken: req.session!.speilToken,
                path: '/api/overstyr/dager',
                method: 'post',
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under overstyring av dager: ${err}`);
                res.status(500).send('Feil under overstyring av dager');
            });
    });

    router.post('/overstyr/inntektogrefusjon', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                body: req.body,
                speilToken: req.session!.speilToken,
                path: '/api/overstyr/inntektogrefusjon',
                method: 'post',
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under overstyring av inntekt og refusjon: ${err}`);
                res.status(500).send('Feil under overstyring av inntekt og refusjon');
            });
    });

    router.post('/overstyr/arbeidsforhold', (req: SpeilRequest, res: Response) => {
        spesialistClient
            .execute({
                body: req.body,
                speilToken: req.session!.speilToken,
                path: '/api/overstyr/arbeidsforhold',
                method: 'post',
            })
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(`Feil under overstyring av arbeidsforhold: ${err}`);
                res.status(500).send('Feil under overstyring av arbeidsforhold');
            });
    });

    return router;
};
