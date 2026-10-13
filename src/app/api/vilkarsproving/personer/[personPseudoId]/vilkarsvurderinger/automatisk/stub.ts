import { NextRequest } from 'next/server';

import {
    ApiNyAutomatiskVilkårsvurderingRequest,
    ApiNyAutomatiskVilkårsvurderingResponse,
    ApiNyAutomatiskVilkårsvurderingStatus,
} from '@io/rest/generated/vilkarsproving.schemas';

import { vurderAutomatiskPåNytt } from '../vilkarsvurderingerMock';

export const stub = async (request: NextRequest) => {
    const body: ApiNyAutomatiskVilkårsvurderingRequest = await request.json();

    const response: ApiNyAutomatiskVilkårsvurderingResponse = {
        status: ApiNyAutomatiskVilkårsvurderingStatus.VURDERT,
        opptjeningsvurderingId: vurderAutomatiskPåNytt(body),
    };

    return Response.json(response);
};
