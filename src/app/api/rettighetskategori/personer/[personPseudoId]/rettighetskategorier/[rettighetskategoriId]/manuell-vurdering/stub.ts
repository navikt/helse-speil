import { NextRequest } from 'next/server';
import { z } from 'zod/v4';

import { Rettighetskategori } from '@io/rest/rettighetskategori';

const requestSchema = z.object({
    tilleggskategorier: z.array(z.literal('JORDBRUKER')),
    begrunnelse: z.string().nullable().optional(),
});

export async function stub(request: NextRequest) {
    const resultat = requestSchema.safeParse(await request.json());
    if (!resultat.success) {
        return Response.json({ title: 'Ugyldig forespørsel', status: 400 }, { status: 400 });
    }
    const avgjørelse: Rettighetskategori = {
        id: crypto.randomUUID(),
        skjæringstidspunkt: '2026-01-01',
        hovedkategori: 'SELVSTENDIG_NAERINGSDRIVENDE',
        tilleggskategorier: resultat.data.tilleggskategorier,
        kilde: 'SAKSBEHANDLER',
        vurderingstidspunkt: new Date().toISOString(),
    };
    return Response.json(avgjørelse);
}
