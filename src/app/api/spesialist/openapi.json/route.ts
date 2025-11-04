import type { OpenAPIObject } from 'openapi3-ts/oas30';

import { videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { spesialistOpenAPITransformer } from '@io/rest/spesialist-openapi-transformer';

export const dynamic = 'force-dynamic';

export const GET = async (request: Request) => videresendTilSpesialist(request).then(rewriteOpenApiSpec);

const rewriteOpenApiSpec = async function (response: Response): Promise<Response> {
    if (!response.ok) {
        return response;
    }

    const openApiSpec = (await response.json()) as OpenAPIObject;

    return Response.json(spesialistOpenAPITransformer(openApiSpec));
};
