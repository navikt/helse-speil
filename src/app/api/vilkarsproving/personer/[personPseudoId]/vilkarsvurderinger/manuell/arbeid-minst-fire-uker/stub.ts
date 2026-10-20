import { NextRequest } from 'next/server';

import { overstyrVilkårsvurdering } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';
import { ApiHandlingType } from '@io/rest/generated/spesialist.schemas';
import {
    ApiManuellArbeidMinstFireUkerVurderingRequest,
    ApiManuellOpptjeningsvurderingResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiManuellArbeidMinstFireUkerVurderingRequest = await request.json();

    const opptjeningsvurderingId = overstyrVilkårsvurdering(personPseudoId, body);
    const response: ApiManuellOpptjeningsvurderingResponse = { opptjeningsvurderingId };

    SaksbehandlerhandlingMock.leggTilHandling(personPseudoId, {
        handlingId: opptjeningsvurderingId,
        handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
        skjæringstidspunkt: body.skjæringstidspunkt,
        behandlingId: null,
        erDelAvAktivTotrinnsvurdering: true,
    });

    return Response.json(response);
};
