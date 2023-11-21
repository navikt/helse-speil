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

const postSpørring = async (
    graphQLClient: GraphQLClient,
    req: SpeilRequest,
    res: Response,
    førsteForsøk: boolean = true,
) => {
    const response = await graphQLClient
        .postGraphQLQuery(req.session!.speilToken, req.session, JSON.stringify(req.body))
        .then((response) => response.json())
        .catch((exeption) => {
            const { error } = exeption;
            if (error === undefined || error === null) {
                logger.sikker.info(`Ingen 'error' i exception=${exeption}`);
            }
            if (førsteForsøk) {
                logger.info(`Feil ved GraphQL-sending, prøver en gang til`, error);
                postSpørring(graphQLClient, req, res, false);
            } else {
                logger.error(`Feil ved GraphQL-sending`, error);
                res.status(200).send(error);
            }
        });
    res.status(200).send(response);
};
