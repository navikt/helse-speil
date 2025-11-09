import { v4 } from 'uuid';

import {
    ApiLeggTilTilkommenInntektRequest,
    ApiTilkommenInntekt,
    ApiTilkommenInntektOpprettetEvent,
} from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export const stub = async (request: Request) => {
    const requestBody: ApiLeggTilTilkommenInntektRequest = await request.json();

    if (TilkommenInntektMock.inntektskilder.get(requestBody.fodselsnummer) === undefined) {
        TilkommenInntektMock.inntektskilder.set(requestBody.fodselsnummer, []);
    }
    const tilkommenInntektskilde = TilkommenInntektMock.finnEllerLeggTilInntektskilde(
        requestBody.verdier.organisasjonsnummer,
        TilkommenInntektMock.inntektskilder.get(requestBody.fodselsnummer) ?? [],
    );

    const nyTilkommenInntektId = v4();

    const inntekt: ApiTilkommenInntekt = {
        organisasjonsnummer: requestBody.verdier.organisasjonsnummer,
        ekskluderteUkedager: requestBody.verdier.ekskluderteUkedager,
        erDelAvAktivTotrinnsvurdering: true,
        events: [
            {
                type: 'ApiTilkommenInntektOpprettetEvent',
                metadata: TilkommenInntektMock.byggEventMetadata(requestBody.notatTilBeslutter, []),
                ekskluderteUkedager: requestBody.verdier.ekskluderteUkedager,
                organisasjonsnummer: requestBody.verdier.organisasjonsnummer,
                periode: requestBody.verdier.periode,
                periodebelop: requestBody.verdier.periodebelop,
            } as ApiTilkommenInntektOpprettetEvent,
        ],
        fjernet: false,
        periode: requestBody.verdier.periode,
        periodebelop: requestBody.verdier.periodebelop,
        tilkommenInntektId: nyTilkommenInntektId,
    };
    tilkommenInntektskilde.inntekter.push(inntekt);

    return Response.json({ tilkommenInntektId: nyTilkommenInntektId });
};
