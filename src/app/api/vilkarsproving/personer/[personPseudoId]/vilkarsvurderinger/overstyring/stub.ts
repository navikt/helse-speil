import { NextRequest } from 'next/server';

import {
    ApiManuellVilkårsvurderingRequest,
    ApiManuellVilkårsvurderingResponse,
} from '@io/rest/generated/vilkarsproving.schemas';

import { overstyrVilkårsvurdering } from '../vilkarsvurderingerMock';

export const stub = async (request: NextRequest) => {
    const body: ApiManuellVilkårsvurderingRequest = await request.json();

    const response: ApiManuellVilkårsvurderingResponse = {
        opptjeningsvurderingId: overstyrVilkårsvurdering(body),
    };

    return Response.json(response);
};
