import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { erLokal, getServerEnv } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';
import { fetchPersondata } from '@spesialist-mock/graphql';

export async function POST(request: NextRequest) {
    let personPseudoId = null;
    const formData = await request.formData();
    const identitetsnummer = formData.get('identitetsnummer')?.toString();
    const aktørId = formData.get('aktørId')?.toString();

    if (erLokal) {
        personPseudoId = fetchPersondata()[identitetsnummer ?? aktørId ?? '']?.personPseudoId;
    } else {
        const wonderwallToken = hentWonderwallToken(request);
        if (!wonderwallToken) {
            return new Response(null, { status: 401 });
        }

        const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }

        const headers = new Headers();
        headers.set('X-Request-Id', uuidv4());
        headers.set('Authorization', `Bearer ${oboResult.token}`);
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        personPseudoId = (
            await (
                await fetch(`${getServerEnv().SPESIALIST_BASEURL}/api/spesialist/person/sok`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        identitetsnummer: identitetsnummer === '' ? undefined : identitetsnummer,
                        aktørId: aktørId === '' ? undefined : aktørId,
                    }),
                    // @ts-expect-error Duplex property is missing in types
                    duplex: 'half',
                })
            ).json()
        ).personPseudoId;
    }

    if (personPseudoId != null) {
        return new Response(null, {
            status: 302,
            headers: { Location: `/person/${personPseudoId}/dagoversikt` },
        });
    } else {
        return new Response(null, {
            status: 404,
        });
    }
}
