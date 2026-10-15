import { NextRequest } from 'next/server';

import { ApiHandlingType } from '@io/rest/generated/spesialist.schemas';
import {
    ApiNyAutomatiskVilkårsvurderingRequest,
    ApiNyAutomatiskVilkårsvurderingResponse,
    ApiNyAutomatiskVilkårsvurderingStatus,
} from '@io/rest/generated/vilkarsproving.schemas';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

import { vurderAutomatiskPåNytt } from '../vilkarsvurderingerMock';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiNyAutomatiskVilkårsvurderingRequest = await request.json();

    const opptjeningsvurderingId = vurderAutomatiskPåNytt(personPseudoId, body);
    const response: ApiNyAutomatiskVilkårsvurderingResponse = {
        status: ApiNyAutomatiskVilkårsvurderingStatus.VURDERT,
        opptjeningsvurderingId,
    };

    SaksbehandlerhandlingMock.leggTilHandling(personPseudoId, {
        handlingId: opptjeningsvurderingId,
        handlingType: ApiHandlingType.NY_AUTOMATISK_OPPTJENINGSVURDERING,
        skjæringstidspunkt: body.skjæringstidspunkt,
        behandlingId: null,
        erDelAvAktivTotrinnsvurdering: false,
    });

    return Response.json(response);
};
