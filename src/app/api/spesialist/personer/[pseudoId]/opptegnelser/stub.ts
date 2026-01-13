import { NextRequest } from 'next/server';

import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const etterSekvensnummer = Number.parseInt(_request.nextUrl.searchParams.get('etterSekvensnummer') ?? '-1');
    return Response.json(OpptegnelseMock.hentOpptegnelserEtter(etterSekvensnummer, pseudoId));
}
