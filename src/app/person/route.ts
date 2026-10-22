import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { backendBaseUrl, skalStubbe } from '@app/api/backends';
import { hentBackendToken } from '@app/api/videresender';

// Endepunkt for å kunne søke opp personer på fødselsnummer eller aktørID.
// Ble laget for å dyplenke fra spanner til aktuell person i speil.

export async function POST(request: NextRequest) {
    let personPseudoId = null;
    const formData = await request.formData();
    const identitetsnummer = formData.get('identitetsnummer')?.toString();
    const aktørId = formData.get('aktørId')?.toString();

    if (skalStubbe('spesialist')) {
        const { PersonMock } = await import('@spesialist-mock/storage/person');
        personPseudoId = PersonMock.findPersonPseudoId(identitetsnummer ?? aktørId ?? '');
    } else {
        const spesialistBaseUrl = backendBaseUrl('spesialist');
        const token = await hentBackendToken('spesialist', request);
        if (token instanceof Response) {
            return IkkeAutentisert;
        }

        const headers = new Headers();
        headers.set('X-Request-Id', uuidv4());
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        personPseudoId = (
            await (
                await fetch(`${spesialistBaseUrl}/api/personer/sok`, {
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
        headers: { Location: `/person/${personPseudoId}` },
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
