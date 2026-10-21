import { ApiOverstyrArbeidsforholdRequest, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { opprettTotrinnsvurderingHvisMangler, pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { finnFødselsnummerForVedtaksperiodeId } from '@spesialist-mock/storage/person';

export const stub = async (request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;
    const body: ApiOverstyrArbeidsforholdRequest = await request.json();
    const fødselsnummer = finnFødselsnummerForVedtaksperiodeId(vedtaksperiodeId)!;

    body.overstyrteArbeidsforhold.forEach((arbeidsforhold) =>
        OverstyringMock.leggTil(fødselsnummer, arbeidsforhold.organisasjonsnummer, {
            type: 'ApiArbeidsforholdoverstyring',
            vedtaksperiodeId,
            skjaeringstidspunkt: body.skjæringstidspunkt,
            deaktivert: arbeidsforhold.deaktivert,
            begrunnelse: arbeidsforhold.begrunnelse,
            forklaring: arbeidsforhold.forklaring,
        }),
    );
    opprettTotrinnsvurderingHvisMangler(fødselsnummer);
    pushEventEtterForsinkelse(fødselsnummer, ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE);

    return new Response(null, { status: 204 });
};
