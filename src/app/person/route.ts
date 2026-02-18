import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { erLokal, getServerEnv } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';
import { PersonMock } from '@spesialist-mock/storage/person';

// Endepunkt for å kunne søke opp personer på fødselsnummer eller aktørID.
// Ble laget for å dyplenke fra spanner til aktuell person i speil.

export async function POST(request: NextRequest) {
    let personPseudoId = null;
    const formData = await request.formData();
    const identitetsnummer = formData.get('identitetsnummer')?.toString();
    const aktørId = formData.get('aktørId')?.toString();

    if (erLokal) {
        personPseudoId = PersonMock.findPersonPseudoId(identitetsnummer ?? aktørId ?? '');
    } else {
        const wonderwallToken = hentWonderwallToken(request);
        if (!wonderwallToken) {
            return IkkeAutentisert;
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
                await fetch(`${getServerEnv().SPESIALIST_BASEURL}/api/personer/sok`, {
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

    return personPseudoId != null ? Suksess(personPseudoId) : IkkeFunnet;
}

const Suksess = (personPseudoId: string) =>
    new Response(null, {
        status: 302,
        headers: { Location: `/person/${personPseudoId}/dagoversikt` },
    });

const IkkeAutentisert = new Response(
    "<html lang='no'><body>Du er ikke autentisert. <a href='/'>Gå til forsiden</a></body></html>",
    {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    },
);

const IkkeFunnet = new Response(null, {
    status: 404,
});
