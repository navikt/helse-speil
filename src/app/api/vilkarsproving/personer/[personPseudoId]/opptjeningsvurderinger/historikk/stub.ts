import { NextRequest } from 'next/server';

import { hentOpptjeningshistorikk } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    return Response.json(
        hentOpptjeningshistorikk(personPseudoId, request.nextUrl.searchParams.get('skjæringstidspunkt') ?? ''),
    );
};
