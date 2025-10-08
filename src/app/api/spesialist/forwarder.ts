import { v4 as uuidv4 } from 'uuid';

import { getServerEnv } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';

export async function forwardGETtoSpesialist(req: Request) {
    const wonderwallToken = hentWonderwallToken(req);
    if (!wonderwallToken) {
        return new Response(null, { status: 401 });
    }

    const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
    }

    const path = req.url.substring(req.url.indexOf('/api/spesialist/') + 16);
    return await fetch(`${getServerEnv().SPESIALIST_BASEURL}/api/${path}`, {
        method: 'get',
        headers: {
            Authorization: `Bearer ${oboResult.token}`,
            'X-Request-Id': uuidv4(),
            Accept: 'application/json',
        },
    });
}

export async function forwardPOSTtoSpesialist(req: Request, requestBody: unknown) {
    const wonderwallToken = hentWonderwallToken(req);
    if (!wonderwallToken) {
        return new Response(null, { status: 401 });
    }

    const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
    }

    const path = req.url.substring(req.url.indexOf('/api/spesialist/') + 16);
    return await fetch(`${getServerEnv().SPESIALIST_BASEURL}/api/${path}`, {
        method: 'post',
        headers: {
            Authorization: `Bearer ${oboResult.token}`,
            'X-Request-Id': uuidv4(),
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
}
