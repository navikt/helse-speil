import { NextRequest } from 'next/server';

import { hentVisning } from '@app/api/avslagsdager/avslagsdagerMock';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

export const stub = async (_request: NextRequest, params: Promise<{ personPseudoId: string; handlingId: string }>) => {
    const { personPseudoId, handlingId } = await params;
    const finnes = SaksbehandlerhandlingMock.hentHandlinger(personPseudoId).some(
        (handling) => handling.handlingId === handlingId,
    );
    const visning = finnes ? hentVisning(handlingId) : undefined;
    if (!visning) return new Response(null, { status: 404 });
    return Response.json(visning);
};
