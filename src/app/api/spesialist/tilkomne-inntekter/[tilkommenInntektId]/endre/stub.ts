import { ApiEndreTilkommenInntektRequest, ApiTilkommenInntektEndretEvent } from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export const stub = async (request: Request, params: Promise<{ tilkommenInntektId: string }>) => {
    const { tilkommenInntektId } = await params;
    const requestBody: ApiEndreTilkommenInntektRequest = await request.json();

    const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
    if (tilkommenInntektMedKontekst === undefined) return new Response(null, { status: 404 });

    const { inntekt, inntektskilde, inntektskilder } = tilkommenInntektMedKontekst;

    inntekt.events.push({
        type: 'ApiTilkommenInntektEndretEvent',
        metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, inntekt.events),
        endringer: TilkommenInntektMock.tilEventEndringer(
            inntekt,
            inntektskilde.organisasjonsnummer,
            requestBody.endretTil,
        ),
    } as ApiTilkommenInntektEndretEvent);

    TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, requestBody.endretTil);

    return new Response(null, { status: 204 });
};
