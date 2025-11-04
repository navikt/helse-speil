import {
    ApiFjernTilkommenInntektRequest,
    ApiTilkommenInntektFjernetEvent,
} from '@io/rest/generated/spesialist.schemas';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function stub(request: Request, params: Promise<{ tilkommenInntektId: string }>) {
    const { tilkommenInntektId } = await params;
    const requestBody: ApiFjernTilkommenInntektRequest = await request.json();

    await sleep(1000 + Math.random() * 1000);

    const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
    if (tilkommenInntektMedKontekst === undefined) return new Response(null, { status: 404 });

    const { inntekt } = tilkommenInntektMedKontekst;

    inntekt.events.push({
        type: 'ApiTilkommenInntektFjernetEvent',
        metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, inntekt.events),
    } as ApiTilkommenInntektFjernetEvent);

    inntekt.fjernet = true;

    return new Response(null, { status: 204 });
}
