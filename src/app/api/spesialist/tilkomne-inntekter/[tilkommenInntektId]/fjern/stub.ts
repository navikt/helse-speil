import {
    ApiFjernTilkommenInntektRequest,
    ApiTilkommenInntektFjernetEvent,
} from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export const stub = async (request: Request, params: Promise<{ tilkommenInntektId: string }>) => {
    const { tilkommenInntektId } = await params;
    const requestBody: ApiFjernTilkommenInntektRequest = await request.json();

    const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
    if (tilkommenInntektMedKontekst === undefined) return new Response(null, { status: 404 });

    const { inntekt } = tilkommenInntektMedKontekst;

    inntekt.events.push({
        type: 'ApiTilkommenInntektFjernetEvent',
        metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, inntekt.events),
    } as ApiTilkommenInntektFjernetEvent);

    inntekt.fjernet = true;

    return new Response(null, { status: 204 });
};
