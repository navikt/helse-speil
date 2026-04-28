import { v4 as uuidv4 } from 'uuid';

import { getServerEnv } from '@/env';
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
    const headersResult = await buildHeaders(request);
    if (headersResult instanceof Response) {
        return headersResult;
    }

    return fetch(spesialistUrl(request), buildBody(request, headersResult));
};

export const videresendSseTilSpesialist = async (request: Request): Promise<Response> => {
    const result = await buildHeaders(request);
    if (result instanceof Response) {
        return result;
    }

    return fetch(spesialistUrl(request), {
        method: request.method,
        headers: result,
        body: request.body,
        signal: request.signal,
        // @ts-expect-error Duplex property is missing in types
        duplex: 'half',
    });
};

const buildHeaders = async (request: Request): Promise<Response | Headers> => {
    const headers = filterHeadersExcept(request.headers, ['host', 'cookie', 'authorization']);

    headers.set('X-Request-Id', uuidv4());

    const wonderwallToken = hentWonderwallToken(request);
    if (!wonderwallToken) {
        return new Response(null, { status: 401 });
    }

    const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
    }
    headers.set('Authorization', `Bearer ${oboResult.token}`);
    return headers;
};

function buildBody(request: Request, headers: Headers) {
    const base = {
        method: request.method,
        headers,
        duplex: 'half',
    };
    return request.body == undefined ? base : { ...base, body: request.body };
}

const spesialistUrl = (request: Request) => {
    const spesialistRelativeUrl = `/api/${substringAfter(request.url, '/api/spesialist/')}`;
    return getServerEnv().SPESIALIST_BASEURL + spesialistRelativeUrl;
};
