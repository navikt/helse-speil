import { NextFunction, Request, Response, Router } from 'express';

import { getToken } from '@navikt/oasis';

import logger from '../logging';
import { FlexjarClient } from './flexjarClient';

interface SetupOptions {
    flexjarClient: FlexjarClient;
}

export default ({ flexjarClient }: SetupOptions) => {
    const router = Router();

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        postOpprett(flexjarClient, req, res).catch(next);
    });
    router.post(`/oppdater/:id`, (req: Request, res: Response, next: NextFunction) => {
        postOppdater(flexjarClient, req.params.id, req, res).catch(next);
    });

    return router;
};

const postOpprett = async (flexjarClient: FlexjarClient, req: Request, res: Response) => {
    const token = getToken(req);
    if (!token) {
        res.sendStatus(401);
        return;
    }

    const response = await flexjarClient
        .postFlexjarQuery(token, JSON.stringify(req.body))
        .then((response) => JSON.stringify(response))
        .catch((error) => logger.info(`Sending av feedback til flexjar feilet: ${error}`));
    logger.info(`Sending av feedback til flexjar, respons: ${JSON.stringify(response)}`);

    if (response) res.status(202).send(response);
    else res.sendStatus(500);
};

const postOppdater = async (flexjarClient: FlexjarClient, id: string, req: Request, res: Response) => {
    const token = getToken(req);
    if (!token) {
        res.sendStatus(401);
        return;
    }

    const response = await flexjarClient.postFlexjarQuery(token, JSON.stringify(req.body), 'PUT', id).catch((error) => {
        logger.info(`Oppdatering av feedback til flexjar feilet: ${error}`);
    });
    if (response) res.status(204).send(JSON.stringify({}));
    else res.sendStatus(500);
};
