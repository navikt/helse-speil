import {
    ApiGjenopprettTilkommenInntektRequest,
    ApiTilkommenInntektGjenopprettetEvent,
} from '@io/rest/generated/spesialist.schemas';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function stub(request: Request, params: Promise<{ tilkommenInntektId: string }>) {
    const { tilkommenInntektId } = await params;
    const requestBody: ApiGjenopprettTilkommenInntektRequest = await request.json();

    await sleep(1000 + Math.random() * 1000);

    const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
    if (tilkommenInntektMedKontekst === undefined) return new Response(null, { status: 404 });

    const { inntekt, inntektskilde, inntektskilder } = tilkommenInntektMedKontekst;

    inntekt.events.push({
        type: 'ApiTilkommenInntektGjenopprettetEvent',
        metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, inntekt.events),
        endringer: TilkommenInntektMock.tilEventEndringer(
            inntekt,
            inntektskilde.organisasjonsnummer,
            requestBody.endretTil,
        ),
    } as ApiTilkommenInntektGjenopprettetEvent);

    TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, requestBody.endretTil);
    inntekt.fjernet = false;

    return new Response(null, { status: 204 });
}
