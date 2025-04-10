import { createYoga } from 'graphql-yoga';
import { notFound } from 'next/navigation';

import { erDev, erProd } from '@/env';
import { buildSchema } from '@spesialist-mock/graphql';

interface NextContext {
    params: Promise<Record<string, string>>;
}

let yogaRequestHandler: ((req: Request, ctx: NextContext) => Response | Promise<Response>) | null;

function getRequestHandler() {
    if (yogaRequestHandler == null) {
        const { handleRequest } = createYoga<NextContext>({
            schema: buildSchema(),
            graphqlEndpoint: '/api/spesialist',
            fetchAPI: { Response },
        });

        yogaRequestHandler = handleRequest;
    }

    return yogaRequestHandler;
}

function handleRequest(req: Request, ctx: NextContext) {
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
