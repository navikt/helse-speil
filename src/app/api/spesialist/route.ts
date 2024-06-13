import { createYoga } from 'graphql-yoga';
import { notFound } from 'next/navigation';

import { erDev, erProd } from '@/env';
import { buildSchema } from '@spesialist-mock/graphql';

let yogaRequestHandler: ((req: Request, ctx: {}) => Response | Promise<Response>) | null;

function getRequestHandler() {
    if (yogaRequestHandler == null) {
        const { handleRequest } = createYoga({
            schema: buildSchema(),
            graphqlEndpoint: '/api/spesialist',
            fetchAPI: { Response },
        });

        yogaRequestHandler = handleRequest;
    }

    return yogaRequestHandler;
}

function handleRequest(req: Request, ctx: {}) {
    if (erProd || erDev) {
        notFound();
    }

    const requestHandler = getRequestHandler();

    if (requestHandler == null) {
        throw new Error('Request handler is not initialized, that should not be possible');
    }

    return requestHandler(req, ctx);
}

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
