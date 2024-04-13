import { NextFunction, Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { sleep } from '../utils';
import { GraphQLClient } from './graphQLClient';

interface SetupOptions {
    graphQLClient: GraphQLClient;
}

export default ({ graphQLClient }: SetupOptions) => {
    const router = Router();

    router.post('/', (req: SpeilRequest, res: Response, next: NextFunction) => {
        retrySpørring(graphQLClient, req, res).catch(next);
    });

    return router;
};

const retrySpørring = async (graphQLClient: GraphQLClient, req: SpeilRequest, res: Response) => {
    let forsøk = 0;
    let response: Response | undefined;
    let giOpp;
    while (!response && !giOpp) {
        forsøk++;
        try {
            response = await postSpørring(graphQLClient, req);
        } catch (error) {
            if (forsøk < 3) {
                const ventetid = 500 * forsøk;
                logger.info(`Prøver å gjøre kall mot spesialist på nytt om ${ventetid}ms, grunnet: ${error}`);
                await sleep(ventetid);
            } else {
                logger.error(`Gir opp å gjøre kall til spesialist etter ${forsøk} forsøk, siste feil: ${error}`);
                giOpp = true;
            }
        }
    }
    if (response) res.status(200).send(response);
    else res.sendStatus(500);
};

const postSpørring = async (graphQLClient: GraphQLClient, req: SpeilRequest) => {
    const data = JSON.stringify(req.body);
    const response = await graphQLClient.postGraphQLQuery(req.session!.speilToken, req.session, data);
    if (!response.ok) throw new Error(`Feil ved kall til spesialist, status: ${response.status}`);
    return await response.json();
};
