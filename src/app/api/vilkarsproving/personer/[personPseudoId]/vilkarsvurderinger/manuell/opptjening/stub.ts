import { NextRequest } from 'next/server';

import { vurderOpptjening } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';
import {
    ApiManuellOpptjeningsvurderingRequest,
    ApiManuellOpptjeningsvurderingResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { registrerManuellOpptjeningsvurdering } from '@spesialist-mock/saksbehandling';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiManuellOpptjeningsvurderingRequest = await request.json();

    const opptjeningsvurderingId = vurderOpptjening(personPseudoId, body);
    const response: ApiManuellOpptjeningsvurderingResponse = { opptjeningsvurderingId };

    registrerManuellOpptjeningsvurdering(personPseudoId, opptjeningsvurderingId, body.skjæringstidspunkt);

    return Response.json(response);
};
