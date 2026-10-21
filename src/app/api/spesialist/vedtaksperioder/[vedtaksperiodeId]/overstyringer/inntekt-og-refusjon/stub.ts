import {
    ApiOverstyrInntektOgRefusjonRequest,
    ApiOverstyrInntektOgRefusjonRequestRefusjonselement,
    ApiRefusjonsopplysning,
    ApiServerSentEventEvent,
} from '@io/rest/generated/spesialist.schemas';
import { opprettTotrinnsvurderingHvisMangler, pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { finnFødselsnummerForVedtaksperiodeId } from '@spesialist-mock/storage/person';

export const stub = async (request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;
    const body: ApiOverstyrInntektOgRefusjonRequest = await request.json();
    const fødselsnummer = finnFødselsnummerForVedtaksperiodeId(vedtaksperiodeId)!;

    // Spesialist lagrer én overstyring per arbeidsgiver
    body.arbeidsgivere.forEach((arbeidsgiver) =>
        OverstyringMock.leggTil(fødselsnummer, arbeidsgiver.organisasjonsnummer, {
            type: 'ApiInntektoverstyring',
            vedtaksperiodeId,
            inntekt: {
                skjaeringstidspunkt: body.skjæringstidspunkt,
                begrunnelse: arbeidsgiver.begrunnelse,
                forklaring: arbeidsgiver.forklaring,
                manedligInntekt: arbeidsgiver.månedligInntekt,
                fraManedligInntekt: arbeidsgiver.fraMånedligInntekt,
                refusjonsopplysninger: tilRefusjonsopplysninger(arbeidsgiver.refusjonsopplysninger),
                fraRefusjonsopplysninger: tilRefusjonsopplysninger(arbeidsgiver.fraRefusjonsopplysninger),
            },
        }),
    );
    opprettTotrinnsvurderingHvisMangler(fødselsnummer);
    pushEventEtterForsinkelse(fødselsnummer, ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE);

    return new Response(null, { status: 204 });
};

function tilRefusjonsopplysninger(
    refusjonselementer?: ApiOverstyrInntektOgRefusjonRequestRefusjonselement[] | null,
): ApiRefusjonsopplysning[] {
    return (refusjonselementer ?? []).map((element) => ({
        fom: element.fom,
        tom: element.tom ?? null,
        belop: element.beløp,
    }));
}
