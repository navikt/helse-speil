import { NextRequest } from 'next/server';

import { hentOpptjeningshistorikk } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';

export const stub = async (request: NextRequest) =>
    Response.json(hentOpptjeningshistorikk(request.nextUrl.searchParams.get('skjæringstidspunkt') ?? ''));
