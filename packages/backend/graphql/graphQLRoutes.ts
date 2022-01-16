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
        graphQLClient
            .postGraphQLQuery(req.session!.speilToken, req.body)
            .then((it) => {
                res.status(200).send(it.body);
            })
            .catch((err) => {
                logger.error(`Feil ved GraphQL-sending: ${err}`);
                res.status(500).send('Feil under GraphQL-sending');
            });
    });

    return router;
};
