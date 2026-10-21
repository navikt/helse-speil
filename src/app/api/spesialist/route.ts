import { createYoga } from 'graphql-yoga';
import { notFound } from 'next/navigation';

import { erDev, erProd } from '@/env';

interface NextContext {
    params: Promise<Record<string, string>>;
}

let yogaRequestHandler: ((req: Request, ctx: NextContext) => Response | Promise<Response>) | null;

async function getRequestHandler() {
    if (yogaRequestHandler == null) {
        const { buildSchema } = await import('@spesialist-mock/graphql');
        const { handleRequest } = createYoga<NextContext>({
            schema: buildSchema(),
            graphqlEndpoint: '/api/spesialist',
            fetchAPI: { Response },
        });

        yogaRequestHandler = handleRequest;
    }

    return yogaRequestHandler;
}

async function handleRequest(req: Request, ctx: NextContext) {
    if (erProd || erDev) {
        notFound();
    }

    const requestHandler = await getRequestHandler();

    if (requestHandler == null) {
        throw new Error('Request handler is not initialized, that should not be possible');
    }

    return requestHandler(req, ctx);
}

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
