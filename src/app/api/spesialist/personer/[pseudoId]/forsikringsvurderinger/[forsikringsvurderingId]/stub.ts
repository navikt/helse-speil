import { NextRequest } from 'next/server';

export async function stub(_request: NextRequest) {
    return Response.json(
        {
            eksisterer: false,
            forsikringInnhold: { gjelderFraDag: 17, dekningsgrad: 100 },
            ekskluderteForsikringer: [
                {
                    virkningsdato: '2026-09-01',
                    dekningsgrad: 100,
                    dekningIVentetid: false,
                    ekskluderingsårsak: 'SKJÆRINGSTIDSPUNKT_INNEN_28_DAGER_FØR_VIRKNINGSDATO',
                },
                {
                    virkningsdato: '2022-08-12',
                    opphørsdato: '2023-08-12',
                    dekningsgrad: 80,
                    dekningIVentetid: true,
                    ekskluderingsårsak: 'OPPHØRT_PÅ_SKJÆRINGSTIDSPUNKT',
                },
            ],
            gjeldendeForsikring: {
                virkningsdato: '2026-08-12',
                opphørsdato: '2026-08-31',
                dekningsgrad: 100,
                dekningIVentetid: false,
            },
        },
        { status: 200 },
    );
}
