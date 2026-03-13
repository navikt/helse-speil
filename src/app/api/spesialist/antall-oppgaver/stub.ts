import { NextRequest } from 'next/server';

import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export async function stub(_request: NextRequest) {
    const tildelinger = TildelingMock.getTildelingerFor('11111111-2222-3333-4444-555555555555');
    const paVent = PaVentMock.getPåVentFor('11111111-2222-3333-4444-555555555555');
    return Response.json({
        antallMineSaker: tildelinger.length,
        antallMineSakerPåVent: paVent.length,
    });
}
