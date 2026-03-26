import { NextRequest, NextResponse } from 'next/server';

import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const putStub = async (_request: NextRequest, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;
    const tildeling = TildelingMock.getTildeling(pseudoId);
    if (!tildeling)
        TildelingMock.setTildeling(pseudoId, {
            epost: 'epost@nav.no',
            navn: 'Utvikler, Lokal',
            oid: '11111111-2222-3333-4444-555555555555',
        });

    return new NextResponse(null, { status: 204 });
};
