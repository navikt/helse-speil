import { videresendTilSpesialist } from '@app/api/spesialist/common';
import { spesialistOpenAPITransformer } from '@io/rest/openapi-transformer';

export const GET = async (request: Request) => videresendTilSpesialist(request).then(rewriteOpenApiSpec);

const rewriteOpenApiSpec = async function (response: Response): Promise<Response> {
    if (!response.ok) {
        return response;
    }

    const openApiSpec = await response.json();

    return Response.json(spesialistOpenAPITransformer(openApiSpec));
};
