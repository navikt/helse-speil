import { v4 as uuidv4 } from 'uuid';

import { getServerEnv } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';

export async function forwardToSpesialist(req: Request) {
    const wonderwallToken = hentWonderwallToken(req);
    if (!wonderwallToken) {
        return new Response(null, { status: 401 });
    }

    const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
    }

    const subPath = req.url.substring(req.url.indexOf('/api/spesialist/') + '/api/spesialist/'.length);
    const proxyRequest = new Request(`${getServerEnv().SPESIALIST_BASEURL}/api/${subPath}`, req.clone());
    proxyRequest.headers.delete('Cookie');
    proxyRequest.headers.set('Authorization', `Bearer ${oboResult.token}`);
    proxyRequest.headers.set('X-Request-Id', uuidv4());

    return fetch(proxyRequest);
}
