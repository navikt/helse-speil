import { NextRequest } from 'next/server';

import {
    ApiNyAutomatiskVilkårsvurderingRequest,
    ApiNyAutomatiskVilkårsvurderingResponse,
    ApiNyAutomatiskVilkårsvurderingStatus,
} from '@io/rest/generated/vilkarsproving.schemas';

import { vurderAutomatiskPåNytt } from '../vilkarsvurderingerMock';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiNyAutomatiskVilkårsvurderingRequest = await request.json();

    const response: ApiNyAutomatiskVilkårsvurderingResponse = {
        status: ApiNyAutomatiskVilkårsvurderingStatus.VURDERT,
        opptjeningsvurderingId: vurderAutomatiskPåNytt(personPseudoId, body),
    };

    return Response.json(response);
};
