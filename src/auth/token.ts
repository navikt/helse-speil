import { IncomingMessage } from 'http';
import { decodeJwt } from 'jose';
import { headers } from 'next/headers';

import { getToken, parseAzureUserToken, requestAzureOboToken } from '@navikt/oasis';

import { erLokal } from '@/env';

export function getTokenPayload() {
    if (erLokal) {
        return {
            oid: 'local-oid',
            preferred_username: 'local-username',
            name: 'Local User',
            NAVident: 'local-ident',
            groups: ['local-group'],
        };
    }

    const token = hentWonderwallToken(headers());
    if (!token) throw new Error('TODO skrive bedre feilmelding');
    const payload = parseAzureUserToken(token);
    if (!payload.ok) throw new Error('TODO skrive bedre feilmelding');
    // TODO: Få oasis til å støtte andre ting i payload, så vi slipper jose direkte
    const josePayload = decodeJwt<{ oid: string; groups: string[] }>(token);
    return { ...payload, oid: josePayload.oid, groups: josePayload.groups };
}

export async function byttTilOboToken(token: string, scope: string): Promise<ReturnType<typeof requestAzureOboToken>> {
    if (erLokal) {
        return {
            ok: true,
            token: 'fake-local-obo-token',
        };
    }

    return requestAzureOboToken(token, scope);
}

export const hentWonderwallToken = (req: Request | IncomingMessage | Headers): string | null => {
    if (erLokal) {
        return 'fake-local-wonderwall-token';
    }

    return getToken(req);
};
