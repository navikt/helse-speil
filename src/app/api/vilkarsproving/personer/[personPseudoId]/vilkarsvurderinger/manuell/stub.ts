import { NextRequest } from 'next/server';

import { ApiHandlingType } from '@io/rest/generated/spesialist.schemas';
import {
    ApiManuellVilkårsvurderingRequest,
    ApiManuellVilkårsvurderingResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

import { overstyrVilkårsvurdering } from '../vilkarsvurderingerMock';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiManuellVilkårsvurderingRequest = await request.json();

    const opptjeningsvurderingId = overstyrVilkårsvurdering(personPseudoId, body);
    const response: ApiManuellVilkårsvurderingResponse = { opptjeningsvurderingId };

    SaksbehandlerhandlingMock.leggTilHandling(personPseudoId, {
        handlingId: opptjeningsvurderingId,
        handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
        skjæringstidspunkt: body.skjæringstidspunkt,
        behandlingId: null,
        erDelAvAktivTotrinnsvurdering: true,
    });

    return Response.json(response);
};
