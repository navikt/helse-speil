import { NextRequest } from 'next/server';

export async function stub(_request: NextRequest, params: Promise<{ meldingsreferanse: string }>) {
    const { meldingsreferanse } = await params;

    return Response.json(
        {
            '@id': meldingsreferanse,
            '@event_name': 'sendt_søknad_nav',
            '@opprettet': '2026-02-01T10:00:00',
            fom: '2026-01-01',
            tom: '2026-01-31',
        },
        { status: 200 },
    );
}
