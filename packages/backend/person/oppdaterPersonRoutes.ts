import { Response, Router } from 'express';

import { HttpMethod, SpesialistClient } from '../http/spesialistClient';
import { Instrumentation } from '../instrumentation';
import logger from '../logging';
import { SpeilRequest } from '../types';

export interface OppdaterPersonDependencies {
    spesialistClient: SpesialistClient;
    instrumentation: Instrumentation;
}

export default ({ spesialistClient, instrumentation }: OppdaterPersonDependencies) => {
    const router = Router();
    router.post('', (req: SpeilRequest, res: Response) => {
        const path = '/api/person/oppdater';
        const tidtakning = instrumentation.requestHistogram.startTidtakning(path);

        const oppdatering = req.body;
        spesialistClient
            .execute({
                speilToken: req.session.speilToken,
                path,
                method: HttpMethod.POST,
                body: oppdatering,
            })
            .then(() => {
                tidtakning();
                res.sendStatus(200);
            })
            .catch((err) => {
                logger.error(`Feil under post: ${err}`);
                res.status(500).send('Feil under post');
            });
    });
    return router;
};
