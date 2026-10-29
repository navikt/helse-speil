import { NextRequest } from 'next/server';

import { Rettighetskategori } from '@io/rest/rettighetskategori';

export async function stub(
    _request: NextRequest,
    params: Promise<{ personPseudoId: string; rettighetskategoriId: string }>,
) {
    const { rettighetskategoriId } = await params;

    const rettighetskategori: Rettighetskategori = {
        id: rettighetskategoriId,
        skjæringstidspunkt: '2026-01-01',
        hovedkategori: 'ARBEIDSTAKER',
        kilde: 'AUTOMATISK',
        vurderingstidspunkt: '2026-02-01T10:00:00Z',
    };

    return Response.json(rettighetskategori, { status: 200 });
}
