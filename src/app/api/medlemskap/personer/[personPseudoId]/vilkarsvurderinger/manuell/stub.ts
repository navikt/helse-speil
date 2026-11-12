import { NextRequest } from 'next/server';

import { vurderMedlemskap } from '@app/api/medlemskap/personer/[personPseudoId]/vilkarsvurderinger/medlemskapMock';
import {
    ApiManuellVilkårsvurderingRequest,
    ApiManuellVilkårsvurderingResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { registrerManuellMedlemskapsvurdering } from '@spesialist-mock/saksbehandling';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiManuellVilkårsvurderingRequest = await request.json();
    const response: ApiManuellVilkårsvurderingResponse = {
        medlemskapsvurderingId: vurderMedlemskap(personPseudoId, body),
    };
    registrerManuellMedlemskapsvurdering(personPseudoId, response.medlemskapsvurderingId, body.skjæringstidspunkt);
    return Response.json(response);
};
