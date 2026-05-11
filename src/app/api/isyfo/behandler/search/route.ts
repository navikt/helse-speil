import { v4 as uuidv4 } from 'uuid';

import { logger } from '@navikt/next-logger';

import { backend, getServerEnv } from '@/env';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';
import { sleep } from '@spesialist-mock/constants';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    if (backend === 'mock' || backend === 'lokal' || backend === 'lokal-spesialist' || backend === 'lokal-sporhund') {
        logger.info('Mocker isyfo behandler/search lokalt / i dev');
        await sleep(200 + Math.random() * 300);
        const body = await req.json();

        const searchstring = (body.searchstring ?? '').toLowerCase();
        const filtered = mockBehandlere.filter(
            (b) =>
                b.fornavn.toLowerCase().includes(searchstring) ||
                b.etternavn.toLowerCase().includes(searchstring) ||
                (b.kontor?.toLowerCase().includes(searchstring) ?? false),
        );

        return Response.json(filtered);
    }
    const wonderwallToken = hentWonderwallToken(req);

    if (!wonderwallToken) {
        return new Response(null, { status: 401 });
    }

    const { SYFO_SCOPE, SYFO_BASEURL } = getServerEnv();
    if (!SYFO_SCOPE || !SYFO_BASEURL) {
        return new Response('isyfo er ikke konfigurert i dette miljøet', { status: 501 });
    }

    const oboResult = await byttTilOboToken(wonderwallToken, SYFO_SCOPE);

    if (!oboResult.ok) {
        throw new Error(`Feil ved henting av OBO-token for isyfo: ${oboResult.error.message}`);
    }

    const body = await req.text();
    return await fetch(`${SYFO_BASEURL}/api/v1/behandler/search`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${oboResult.token}`,
            'Content-Type': 'application/json',
            'X-Request-Id': uuidv4(),
        },
        body,
    });
}

const mockBehandlere = [
    {
        behandlerRef: 'behandlerId-1',
        kategori: 'LEGE',
        fnr: '12345678901',
        hprId: 9001234,
        fornavn: 'Linus',
        mellomnavn: null,
        etternavn: 'Lansen',
        orgnummer: '123456789',
        kontor: 'Lege- og fysioterapisenteret',
        adresse: 'Storgata 1',
        postnummer: '0182',
        poststed: 'Oslo',
        telefon: '22334455',
        type: null,
    },
    {
        behandlerRef: 'behandlerId-2',
        kategori: 'LEGE',
        fnr: '98765432100',
        hprId: 9005678,
        fornavn: 'Solveig',
        mellomnavn: null,
        etternavn: 'Solberg',
        orgnummer: '987654321',
        kontor: 'Sentrum legesenter',
        adresse: 'Kirkegata 12',
        postnummer: '0153',
        poststed: 'Oslo',
        telefon: '22556677',
        type: null,
    },
    {
        behandlerRef: 'behandlerId-3',
        kategori: 'LEGE',
        fnr: '11223344556',
        hprId: 9009876,
        fornavn: 'Christian',
        mellomnavn: 'Andre',
        etternavn: 'Christensen',
        orgnummer: '456789123',
        kontor: 'Bydelens helsesenter',
        adresse: 'Parkveien 45',
        postnummer: '0350',
        poststed: 'Oslo',
        telefon: '22889900',
        type: null,
    },
];
