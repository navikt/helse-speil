import { ApiOverstyrTidslinjeRequest, ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { opprettTotrinnsvurderingHvisMangler, pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { Dagtype } from '@spesialist-mock/schemaTypes';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import {
    finnFødselsnummerForVedtaksperiodeId,
    finnOrganisasjonsnummerForVedtaksperiodeId,
} from '@spesialist-mock/storage/person';

export const stub = async (request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;
    const body: ApiOverstyrTidslinjeRequest = await request.json();
    const fødselsnummer = finnFødselsnummerForVedtaksperiodeId(vedtaksperiodeId)!;
    const organisasjonsnummer = finnOrganisasjonsnummerForVedtaksperiodeId(vedtaksperiodeId)!;

    OverstyringMock.leggTil(fødselsnummer, organisasjonsnummer, {
        __typename: 'Dagoverstyring',
        vedtaksperiodeId,
        begrunnelse: body.begrunnelse,
        dager: body.dager.map((dag) => ({
            dato: dag.dato,
            type: dag.type as Dagtype,
            fraType: dag.fraType as Dagtype,
            grad: dag.grad ?? null,
            fraGrad: dag.fraGrad ?? null,
        })),
    });
    opprettTotrinnsvurderingHvisMangler(fødselsnummer);
    pushEventEtterForsinkelse(fødselsnummer, ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE);

    return new Response(null, { status: 204 });
};
