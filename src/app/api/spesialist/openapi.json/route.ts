import { NextRequest } from 'next/server';

import { videresendTilSpesialist } from '@app/api/spesialist/videresender';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    return videresendTilSpesialist(request).then(rewriteOpenApiSpec);
}

const rewriteOpenApiSpec = async (response: any) => {
    if (!response.ok) {
        return response;
    }
    const openApi = (await response.json()) as any;

    // Ta bort security scheme fra toppen, siden det håndteres av OBO-flyten i rutingen
    openApi.components.securitySchemes = undefined;

    // Korriger paths
    const endredePaths: any = {};
    for (const [path, item] of Object.entries(openApi.paths)) {
        // Endre fra /api/* til /api/spesialist/*
        const speilPath = path.replace(/^\/api\//, '/api/spesialist/');

        // Ta bort security scheme fra hver operasjon, siden det håndteres av OBO-flyten i rutingen
        for (const metode of ['get', 'put', 'post', 'patch', 'delete', 'options', 'head', 'trace']) {
            const operasjon = (item as any)[metode];
            if (operasjon) {
                operasjon.security = undefined;
            }
        }
        endredePaths[speilPath] = item;
    }

    return Response.json({ ...openApi, paths: endredePaths });
};
