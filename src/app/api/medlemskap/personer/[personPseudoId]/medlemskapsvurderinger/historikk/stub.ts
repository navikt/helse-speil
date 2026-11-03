import { NextRequest } from 'next/server';

import { hentMedlemskapshistorikk } from '@app/api/medlemskap/personer/[personPseudoId]/vilkarsvurderinger/medlemskapMock';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    return Response.json(
        hentMedlemskapshistorikk(personPseudoId, request.nextUrl.searchParams.get('skjæringstidspunkt') ?? ''),
    );
};
