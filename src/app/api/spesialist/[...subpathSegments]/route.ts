import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { erLokal, getServerEnv } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';
import { oppgaveliste } from '@spesialist-mock/data/oppgaveoversikt';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export const dynamic = 'force-dynamic';

function mockSaksbehandlere(subpath: string) {
    if (subpath === 'aktive-saksbehandlere') {
        return Response.json([
            {
                ident: 'A123456',
                navn: 'Utvikler, Lokal',
                oid: '31cfdfe8-cd9b-4d28-850f-ab9ccc0ea281',
            },
        ]);
    }
    return undefined;
}

function mockOppgaver(subpath: string, searchParams: URLSearchParams) {
    if (subpath === 'oppgaver') {
        return Response.json(oppgaveliste(searchParams));
    }
    return undefined;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ subpathSegments: string[] }> }) {
    const { subpathSegments } = await params;

    // Unngå kreative angrep - whitelist hvilke subpaths som er lov
    const whitelist = /^[A-Za-zæøåÆØÅ0-9\-]+$/;
    for (const segment of subpathSegments) {
        if (!whitelist.test(segment)) return Response.json({}, { status: 404 });
    }

    const subpath = subpathSegments.join('/');

    if (erLokal) {
        return (
            (await TilkommenInntektMock.håndterGet(subpathSegments)) ??
            mockSaksbehandlere(subpath) ??
            mockOppgaver(subpath, req.nextUrl.searchParams) ??
            Response.json({ feil: 'Ikke mocket opp lokalt' }, { status: 404 })
        );
    } else {
        const wonderwallToken = hentWonderwallToken(req);
        if (!wonderwallToken) {
            return new Response(null, { status: 401 });
        }

        const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }

        return await fetch(`${getServerEnv().SPESIALIST_BASEURL}/api/${subpath}`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${oboResult.token}`,
                'X-Request-Id': uuidv4(),
                Accept: 'application/json',
            },
        });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ subpathSegments: string[] }> }) {
    const { subpathSegments } = await params;
    const requestBody = await req.json();

    // Unngå kreative angrep - whitelist hvilke subpaths som er lov
    const whitelist = /^[A-Za-zæøåÆØÅ0-9\-]+$/;
    for (const segment of subpathSegments) {
        if (!whitelist.test(segment)) return Response.json({}, { status: 404 });
    }

    const subpath = subpathSegments.join('/');

    if (erLokal) {
        return (
            (await TilkommenInntektMock.håndterPost(subpathSegments, requestBody)) ??
            Response.json({ feil: 'Ikke mocket opp lokalt' }, { status: 404 })
        );
    } else {
        const wonderwallToken = hentWonderwallToken(req);
        if (!wonderwallToken) {
            return new Response(null, { status: 401 });
        }

        const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }

        return await fetch(`${getServerEnv().SPESIALIST_BASEURL}/api/${subpath}`, {
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
}
