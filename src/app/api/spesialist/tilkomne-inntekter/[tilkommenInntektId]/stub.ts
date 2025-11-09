import {
    ApiTilkommenInntektEndretEvent,
    ApiTilkommenInntektFjernetEvent,
    ApiTilkommenInntektGjenopprettetEvent,
    ApiTilkommenInntektPatch,
} from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export const stub = async (request: Request, params: Promise<{ tilkommenInntektId: string }>) => {
    const { tilkommenInntektId } = await params;
    const requestBody: ApiTilkommenInntektPatch = await request.json();

    const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
    if (tilkommenInntektMedKontekst === undefined) return new Response(null, { status: 404 });

    const { inntekt, inntektskilde, inntektskilder } = tilkommenInntektMedKontekst;

    if (requestBody.endringer.fjernet?.fra === true && requestBody.endringer.fjernet?.til === false) {
        inntekt.events.push({
            type: 'ApiTilkommenInntektGjenopprettetEvent',
            metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, inntekt.events),
            endringer: TilkommenInntektMock.tilEventEndringer(requestBody.endringer),
        } as ApiTilkommenInntektGjenopprettetEvent);

        TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, requestBody.endringer);
        inntekt.fjernet = false;
    } else {
        if (
            requestBody.endringer.organisasjonsnummer ||
            requestBody.endringer.periode ||
            requestBody.endringer.periodebeløp ||
            requestBody.endringer.ekskluderteUkedager
        ) {
            inntekt.events.push({
                type: 'ApiTilkommenInntektEndretEvent',
                metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, inntekt.events),
                endringer: TilkommenInntektMock.tilEventEndringer(requestBody.endringer),
            } as ApiTilkommenInntektEndretEvent);

            TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, requestBody.endringer);
        }
        if (requestBody.endringer.fjernet?.fra === false && requestBody.endringer.fjernet?.til === true) {
            inntekt.events.push({
                type: 'ApiTilkommenInntektFjernetEvent',
                metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, inntekt.events),
            } as ApiTilkommenInntektFjernetEvent);

            inntekt.fjernet = true;
        }
    }

    return new Response(null, { status: 204 });
};
