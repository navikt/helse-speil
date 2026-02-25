import { v4 as uuidv4 } from 'uuid';

import { getServerEnv, spesialistBackend } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';

const substringAfter = (url: string, searchString: string) =>
    url.substring(url.indexOf(searchString) + searchString.length);

function filterHeadersExcept(original: Headers, exceptNames: string[]) {
    const filtered = new Headers();
    original
        .entries()
        .filter(([name]) => !exceptNames.includes(name.toLowerCase()))
        .forEach(([name, value]) => filtered.append(name, value));
    return filtered;
}

export const videresendTilSpesialist = async (request: Request): Promise<Response> => {
    const headers = filterHeadersExcept(request.headers, ['host', 'cookie', 'authorization']);

    headers.set('X-Request-Id', uuidv4());
    let token: string;

    if (spesialistBackend === 'lokal') {
        token = await fetch('http://localhost:8080/local-token').then((res) => res.text());
    } else {
        const wonderwallToken = hentWonderwallToken(request);
        if (!wonderwallToken) {
            return new Response(null, { status: 401 });
        }

        const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }
        token = oboResult.token;
    }

    headers.set('Authorization', `Bearer ${token}`);

    const spesialistRelativeUrl = `/api/${substringAfter(request.url, '/api/spesialist/')}`;

    return fetch(`${getServerEnv().SPESIALIST_BASEURL}${spesialistRelativeUrl}`, {
        method: request.method,
        headers: headers,
        body: request.body,
        // @ts-expect-error Duplex property is missing in types
        duplex: 'half',
    });
};
