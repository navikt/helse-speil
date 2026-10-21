import { NextRequest, NextResponse } from 'next/server';

import { lokalTildeling } from '@spesialist-mock/constants';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const putStub = async (_request: NextRequest, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;
    const tildeling = TildelingMock.getTildeling(pseudoId);
    if (!tildeling) TildelingMock.setTildeling(pseudoId, lokalTildeling);

    return new NextResponse(null, { status: 204 });
};
