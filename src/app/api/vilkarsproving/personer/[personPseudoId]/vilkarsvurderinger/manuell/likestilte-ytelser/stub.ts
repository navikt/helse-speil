import { NextRequest } from 'next/server';

import { vurderLikestiltYtelse } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';
import {
    ApiManuellLikestiltYtelseVurderingRequest,
    ApiManuellOpptjeningsvurderingResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { registrerManuellOpptjeningsvurdering } from '@spesialist-mock/saksbehandling';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiManuellLikestiltYtelseVurderingRequest = await request.json();

    const opptjeningsvurderingId = vurderLikestiltYtelse(personPseudoId, body);
    const response: ApiManuellOpptjeningsvurderingResponse = { opptjeningsvurderingId };

    registrerManuellOpptjeningsvurdering(personPseudoId, opptjeningsvurderingId, body.skjæringstidspunkt);

    return Response.json(response);
};
