import { NextRequest, NextResponse } from 'next/server';

import {
    ApiServerSentEventEvent,
    ApiSkjonnsfastsettingstype,
    ApiSykepengegrunnlagRequestApiSykepengegrunnlagtypeApiSkjønnsfastsattApiSkjønnsfastsettelsestype as ApiSkjønnsfastsettelsestype,
    ApiSykepengegrunnlagRequest,
} from '@io/rest/generated/spesialist.schemas';
import { opprettTotrinnsvurderingHvisMangler, pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (request: NextRequest, params: Promise<{ pseudoId: string; skjæringstidspunkt: string }>) => {
    const { pseudoId, skjæringstidspunkt } = await params;
    const body: ApiSykepengegrunnlagRequest = await request.json();

    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (fødselsnummer) {
        const { skjønnsfastsettelsestype, skjønnsfastsatteInntekter } = body.sykepengegrunnlagstype;
        // Spesialist lagrer én skjønnsfastsetting per arbeidsgiver
        skjønnsfastsatteInntekter.forEach((inntekt) =>
            OverstyringMock.leggTil(fødselsnummer, inntekt.organisasjonsnummer, {
                type: 'ApiSykepengegrunnlagskjonnsfastsetting',
                vedtaksperiodeId: body.intierendeVedtaksperiodeId,
                skjonnsfastsatt: {
                    arsak: body.årsak,
                    type: tilSkjønnsfastsettingstype(skjønnsfastsettelsestype),
                    begrunnelse: body.begrunnelseFritekst ?? null,
                    begrunnelseMal: body.begrunnelseMal ?? null,
                    begrunnelseFritekst: body.begrunnelseFritekst ?? null,
                    begrunnelseKonklusjon: body.begrunnelseKonklusjon ?? null,
                    arlig: inntekt.årlig,
                    fraArlig: inntekt.fraÅrlig,
                    skjaeringstidspunkt: decodeURIComponent(skjæringstidspunkt),
                },
            }),
        );
        opprettTotrinnsvurderingHvisMangler(fødselsnummer);
        pushEventEtterForsinkelse(fødselsnummer, ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE);
    }

    return new NextResponse(null, { status: 204 });
};

function tilSkjønnsfastsettingstype(type: ApiSkjønnsfastsettelsestype): ApiSkjonnsfastsettingstype {
    switch (type) {
        case 'OMREGNET_ÅRSINNTEKT':
            return ApiSkjonnsfastsettingstype.OMREGNET_ARSINNTEKT;
        case 'RAPPORTERT_ÅRSINNTEKT':
            return ApiSkjonnsfastsettingstype.RAPPORTERT_ARSINNTEKT;
        case 'ANNET':
            return ApiSkjonnsfastsettingstype.ANNET;
    }
}
