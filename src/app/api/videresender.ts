import { v4 as uuidv4 } from 'uuid';

import { BackendNavn, backendBaseUrl, backendConfig, backendScope, kjørerLokalt } from '@app/api/backends';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';

/**
 * Videresender /api/<navn>/x til backenden med OBO-token.
 * Lokalt hentes tokenet fra backendens eget /local-token, så backenden må kjøre.
 */
export function lagVideresender(navn: BackendNavn) {
    return async (request: Request): Promise<Response> => {
        const token = await hentBackendToken(navn, request);
        if (token instanceof Response) return token;

        const headers = filterHeadersExcept(request.headers, ['host', 'cookie', 'authorization']);
        headers.set('X-Request-Id', uuidv4());
        Object.entries(backendConfig(navn).ekstraHeadere ?? {}).forEach(([name, value]) => headers.set(name, value));
        headers.set('Authorization', `Bearer ${token}`);

        return fetch(backendUrl(navn, request.url), {
            method: request.method,
            headers,
            body: request.body,
            // Avbryter kallet mot backenden når nettleseren kobler fra, viktig for SSE
            signal: request.signal,
            // @ts-expect-error Duplex property is missing in types
            duplex: 'half',
        });
    };
}

/** Returnerer et token for kall mot backenden, eller en 401-respons hvis brukeren ikke er logget inn. */
export async function hentBackendToken(navn: BackendNavn, request: Request): Promise<string | Response> {
    if (kjørerLokalt(navn)) {
        const res = await fetch(`${backendBaseUrl(navn)}/local-token`);
        if (!res.ok) {
            throw new Error(
                `Feil ved henting av lokalt token fra ${navn}: ${res.status} ${res.statusText}. Kjører ${navn} lokalt?`,
            );
        }
        return res.text();
    }

    const wonderwallToken = hentWonderwallToken(request);
    if (!wonderwallToken) {
        return new Response(null, { status: 401 });
    }

    const oboResult = await byttTilOboToken(wonderwallToken, backendScope(navn));
    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token for ${navn}: ${oboResult.error.message}`);
    }
    return oboResult.token;
}

export function backendUrl(navn: BackendNavn, requestUrl: string): string {
    const fraSti = `/api/${navn}/`;
    const relativSti = requestUrl.substring(requestUrl.indexOf(fraSti) + fraSti.length);
    return `${backendBaseUrl(navn)}${backendConfig(navn).målprefiks}/${relativSti}`;
}

function filterHeadersExcept(original: Headers, exceptNames: string[]) {
    const filtered = new Headers();
    original
        .entries()
        .filter(([name]) => !exceptNames.includes(name.toLowerCase()))
        .forEach(([name, value]) => filtered.append(name, value));
    return filtered;
}
