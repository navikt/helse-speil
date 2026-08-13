import { NextRequest } from 'next/server';

export async function stub(_request: NextRequest) {
    return Response.json(
        {
            eksisterer: true,
            forsikringInnhold: { gjelderFraDag: 17, dekningsgrad: 100 },
            ekskluderteForsikringer: [
                {
                    virkningsdato: '2026-09-01',
                    dekningsgrad: 100,
                    dekningIVentetid: false,
                    navn: '100 % fra dag 17',
                    folketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 36, ledd: 1, bokstav: 'b' },
                    ekskluderingsårsak: 'SKJÆRINGSTIDSPUNKT_INNEN_28_DAGER_FØR_VIRKNINGSDATO',
                    ekskluderingsbegrunnelse: {
                        forklaring: 'Forsikringen var ikke ennå gyldig på skjæringstidspunktet',
                        folketrygdlovenreferanse: null,
                    },
                },
                {
                    virkningsdato: '2022-08-12',
                    opphørsdato: '2023-08-12',
                    dekningsgrad: 80,
                    dekningIVentetid: true,
                    navn: '80 % fra dag 1',
                    folketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 36, ledd: 1, bokstav: 'a' },
                    ekskluderingsårsak: 'OPPHØRT_PÅ_SKJÆRINGSTIDSPUNKT',
                    ekskluderingsbegrunnelse: {
                        forklaring: 'Forsikringen var opphørt på skjæringstidspunktet',
                        folketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 37, ledd: null, bokstav: null },
                    },
                },
            ],
            gjeldendeForsikring: {
                virkningsdato: '2026-08-12',
                opphørsdato: '2026-08-31',
                dekningsgrad: 100,
                dekningIVentetid: false,
                navn: '100 % fra dag 17',
                folketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 36, ledd: 1, bokstav: 'b' },
            },
            dataHentetTidspunkt: '2025-07-15T12:34:56.789101112Z',
        },
        { status: 200 },
    );
}
