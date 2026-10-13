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

    const response: ApiManuellVilkårsvurderingResponse = {
        opptjeningsvurderingId: overstyrVilkårsvurdering(personPseudoId, body),
    };

    SaksbehandlerhandlingMock.leggTilHandling(personPseudoId, {
        handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
        skjæringstidspunkt: body.skjæringstidspunkt,
        behandlingId: null,
        erDelAvAktivTotrinnsvurdering: true,
    });

    return Response.json(response);
};
