import { Response } from 'express';

import { Instrumentation } from '../instrumentation';
import logger from '../logging';
import { HttpMethod, SpesialistClient } from '../tildeling/spesialistClient';
import { SpeilRequest } from '../types';

export interface OppdaterPersonDependencies {
    spesialistClient: SpesialistClient;
    instrumentation: Instrumentation;
}

export default ({ spesialistClient, instrumentation }: OppdaterPersonDependencies) => {
    return (req: SpeilRequest, res: Response) => {
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
    };
};
