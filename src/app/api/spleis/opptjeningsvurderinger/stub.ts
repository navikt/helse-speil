import { NextRequest } from 'next/server';

import { SpleisOpptjeningsvurderingerRequest } from '@io/rest/spleis';

export async function stub(request: NextRequest) {
    const { fødselsnummer }: Partial<SpleisOpptjeningsvurderingerRequest> = await request.json();

    if (fødselsnummer == null) return new Response(null, { status: 400 });

    return Response.json(
        {
            opptjeningsvurderinger: [
                {
                    opptjeningsvurderingId: '0f6b3c8e-6d7a-4a52-9d55-1b2a3c4d5e6f',
                    opprettet: '2026-02-01T10:00:00',
                    skjæringstidspunkt: '2026-01-01',
                    kilde: 'SPLEIS',
                    type: 'ARBEIDSTAKER',
                    oppfylt: true,
                    opptjeningsperiode: { fom: '2025-01-01', tom: '2025-12-31' },
                    antallDager: 365,
                    arbeidsforhold: [
                        {
                            organisasjonsnummer: '987654321',
                            ansettelsesperioder: [{ fom: '2020-01-01', tom: null }],
                        },
                    ],
                },
            ],
        },
        { status: 200 },
    );
}
