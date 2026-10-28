import { NextRequest } from 'next/server';

import { vurderMedlemskap } from '@app/api/medlemskap/personer/[personPseudoId]/vilkarsvurderinger/medlemskapMock';
import {
    ApiManuellVilkårsvurderingRequest,
    ApiManuellVilkårsvurderingResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiManuellVilkårsvurderingRequest = await request.json();
    const response: ApiManuellVilkårsvurderingResponse = {
        medlemskapsvurderingId: vurderMedlemskap(personPseudoId, body),
    };
    return Response.json(response);
};
