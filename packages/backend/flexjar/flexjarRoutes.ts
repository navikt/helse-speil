import { NextFunction, Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { FlexjarClient } from './flexjarClient';

interface SetupOptions {
    flexjarClient: FlexjarClient;
}

export default ({ flexjarClient }: SetupOptions) => {
    const router = Router();

    router.post('/', (req: SpeilRequest, res: Response, next: NextFunction) => {
        postOpprett(flexjarClient, req, res).catch(next);
    });
    router.post(`/oppdater`, (req: SpeilRequest, res: Response, next: NextFunction) => {
        postOppdater(flexjarClient, req, res).catch(next);
    });

    return router;
};

const postOpprett = async (flexjarClient: FlexjarClient, req: SpeilRequest, res: Response) => {
    let fetchFeilet = false;
    await flexjarClient
        .postFlexjarQuery(req.session!.speilToken, req.session, JSON.stringify(req.body))
        .catch((error) => {
            fetchFeilet = true;
            logger.info(`Sending av feedback til flexjar feilet: ${error}`);
        });
    if (fetchFeilet) res.sendStatus(500);

    res.sendStatus(202);
};

const postOppdater = async (flexjarClient: FlexjarClient, req: SpeilRequest, res: Response) => {
    let response: Response | undefined;
    await flexjarClient
        .postFlexjarQuery(req.session!.speilToken, req.session, JSON.stringify(req.body), 'PUT')
        .then((response) => response.json())
        .catch((error) => {
            logger.info(`Oppdatering av feedback til flexjar feilet: ${error}`);
        });
    logger.info(`Oppdatert flexjar-feedback, respons: ${response}`);
    if (response) res.status(204).send(response);
    else res.sendStatus(500);
};
