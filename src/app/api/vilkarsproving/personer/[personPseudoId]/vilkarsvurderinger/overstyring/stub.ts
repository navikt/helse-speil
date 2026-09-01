import { NextRequest } from 'next/server';

import {
    ApiOverstyrVilkårsvurderingRequest,
    ApiOverstyrVilkårsvurderingResponse,
} from '@io/rest/generated/vilkarsproving.schemas';

import { overstyrVilkårsvurdering } from '../vilkarsvurderingerMock';

export const stub = async (request: NextRequest) => {
    const body: ApiOverstyrVilkårsvurderingRequest = await request.json();

    const response: ApiOverstyrVilkårsvurderingResponse = {
        opptjeningsvurderingId: overstyrVilkårsvurdering(body),
    };

    return Response.json(response);
};
