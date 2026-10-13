import { NextRequest } from 'next/server';

import { hentVilkårsvurderinger } from './vilkarsvurderingerMock';

export const stub = async (_request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    return Response.json(hentVilkårsvurderinger(personPseudoId));
};
