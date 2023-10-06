import { Response, Router } from 'express';

import logger from '../logging';
import { SpeilRequest } from '../types';
import { GraphQLClient } from './graphQLClient';

interface SetupOptions {
    graphQLClient: GraphQLClient;
}

export default ({ graphQLClient }: SetupOptions) => {
    const router = Router();

    router.post('/', (req: SpeilRequest, res: Response) => {
        postSpørring(graphQLClient, req, res);
    });

    return router;
};

const postSpørring = (graphQLClient: GraphQLClient, req: SpeilRequest, res: Response, førsteForsøk: boolean = true) => {
    graphQLClient
        .postGraphQLQuery(req.session!.speilToken, req.session, req.body)
        .then((it) => {
            res.status(200).send(it.body);
        })
        .catch(({ error }) => {
            if (førsteForsøk) {
                logger.info(`Feil ved GraphQL-sending, prøver en gang til`, error);
                postSpørring(graphQLClient, req, res, false);
            } else {
                logger.error(`Feil ved GraphQL-sending`, error);
                res.status(200).send(error);
            }
        });
};
