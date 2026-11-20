import { NextRequest } from 'next/server';

import { ApiSykepengegrunnlagListe } from '@io/rest/generated/sykepengegrunnlag/sykepengegrunnlag.schemas';
import { problemDetails } from '@spesialist-mock/problemDetails';

export async function stub(request: NextRequest, _params: Promise<{ personPseudoId: string }>) {
    const skjæringstidspunkt = request.nextUrl.searchParams.get('skjaeringstidspunkt');
    if (!skjæringstidspunkt) return problemDetails(400, null, 'Mangler gyldig skjæringstidspunkt');

    const response: ApiSykepengegrunnlagListe = {
        sykepengegrunnlag: [
            {
                id: '2b0a6f4e-8f0e-4f7a-9f1d-6d1f3b2c4a51',
                opphav: 'VILKARSPROVING',
                skjæringstidspunkt,
                rettighetskategoriId: '60a28c62-49b6-4c76-8236-26f922edfd6c',
                grunnbeløp: 130160,
                seksG: 780960,
                beregningsgrunnlag: 360000,
                sykepengegrunnlag: 360000,
                er6GBegrenset: false,
                arbeidsgivere: [
                    {
                        orgnummer: '967170232',
                        inntektskilde: 'INNTEKTSMELDING',
                        inntektsmeldingInternDokumentId: '9d7c1e2a-3b4f-4a5e-8c6d-7e8f9a0b1c2d',
                        inntektsmeldingHentet: '2026-02-01T09:59:00Z',
                        aOrdningsoppslagId: null,
                        aOrdningenHentet: null,
                        skatteopplysninger: [],
                        omregnetÅrsinntekt: 360000,
                        skjønnsfastsatt: null,
                        fastsattÅrsinntekt: 360000,
                    },
                ],
                selvstendig: null,
                lovreferanser: [
                    {
                        lov: 'folketrygdloven',
                        paragraf: '8-10',
                        avsnitt: 2,
                        setning: 1,
                        bokstav: null,
                        iKraftFra: '2020-01-01',
                        utfall: 'VILKAR_BEREGNET',
                    },
                ],
            },
        ],
    };

    return Response.json(response);
}
