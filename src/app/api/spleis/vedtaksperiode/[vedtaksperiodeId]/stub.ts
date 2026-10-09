import { NextRequest } from 'next/server';

import { SpleisVedtaksperiode, SpleisVedtaksperiodeRequest } from '@io/rest/spleis';

export async function stub(request: NextRequest, params: Promise<{ vedtaksperiodeId: string }>) {
    const { vedtaksperiodeId } = await params;
    const { fødselsnummer }: Partial<SpleisVedtaksperiodeRequest> = await request.json();

    if (fødselsnummer == null) return new Response(null, { status: 400 });

    const vedtaksperiode: SpleisVedtaksperiode = {
        organisasjonsnummer: '987654321',
        yrkesaktivitetstype: 'ARBEIDSTAKER',
        id: vedtaksperiodeId,
        tilstand: 'AVVENTER_GODKJENNING',
        skjæringstidspunkt: '2026-01-01',
        fom: '2026-01-01',
        tom: '2026-01-31',
        sykmeldingFom: '2026-01-01',
        sykmeldingTom: '2026-01-31',
        opprettet: '2026-02-01T10:00:00',
        oppdatert: '2026-02-01T12:00:00',
    };

    return Response.json(vedtaksperiode, { status: 200 });
}
