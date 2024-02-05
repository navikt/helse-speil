import { NextFunction, Response, Router } from 'express';

import { sleep } from '../devHelpers';
import logger from '../logging';
import { SpeilRequest } from '../types';
import { GraphQLClient } from './graphQLClient';

interface SetupOptions {
    graphQLClient: GraphQLClient;
}

export default ({ graphQLClient }: SetupOptions) => {
    const router = Router();

    router.post('/', (req: SpeilRequest, res: Response, next: NextFunction) => {
        postSpørring(graphQLClient, req, res).catch(next);
    });

    return router;
};

const postSpørring = async (graphQLClient: GraphQLClient, req: SpeilRequest, res: Response) => {
    let forsøk = 0;
    let response: Response | undefined;
    let giOpp;
    while (!response && !giOpp) {
        forsøk++;
        response = await graphQLClient
            .postGraphQLQuery(req.session!.speilToken, req.session, JSON.stringify(req.body))
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
