import { NextRequest } from 'next/server';

import { hentMedlemskapsvurdering } from './medlemskapMock';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const medlemskapsvurderingId = request.nextUrl.searchParams.get('medlemskapsvurderingId') ?? '';
    const vurdering = hentMedlemskapsvurdering(personPseudoId, medlemskapsvurderingId);
    if (!vurdering) {
        return Response.json(
            { type: 'about:blank', title: 'Vurdering ikke funnet', status: 404, instance: request.nextUrl.pathname },
            { status: 404 },
        );
    }
    return Response.json(vurdering);
};
