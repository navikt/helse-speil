import { NextFunction, Request, Response, Router } from 'express';

import { getToken } from '@navikt/oasis';

import { sleep } from '../devHelpers';
import logger from '../logging';
import { GraphQLClient } from './graphQLClient';

interface SetupOptions {
    graphQLClient: GraphQLClient;
}

export default ({ graphQLClient }: SetupOptions) => {
    const router = Router();

    router.post('/', (req: Request, res: Response, next: NextFunction) => {
        postSpørring(graphQLClient, req, res).catch(next);
    });

    return router;
};

const postSpørring = async (graphQLClient: GraphQLClient, req: Request, res: Response) => {
    const token = getToken(req);
    if (!token) {
        res.sendStatus(401);
        return;
    }

    let forsøk = 0;
    let response: Response | undefined;
    let giOpp;
    // TODO: Fjerne server side retry, la dette være en pure proxy og la apollo fikse retry
    while (!response && !giOpp) {
        forsøk++;
        response = await graphQLClient
            .postGraphQLQuery(token, JSON.stringify(req.body))
            .then((response) => response.json())
            .catch((error) => {
                if (forsøk < 3) {
                    logger.info(`Prøver å gjøre kall mot spesialist på nytt, grunnet: ${error}`);
                } else {
                    logger.error(`Gir opp å gjøre kall til spesialist etter ${forsøk} forsøk, siste feil: ${error}`);
                    giOpp = true;
                }
            });
        await sleep(500 * forsøk);
    }
    if (response) res.status(200).send(response);
    else res.sendStatus(500);
};
