import { NextRequest, NextResponse } from 'next/server';

import { TildelingMock } from '@spesialist-mock/storage/tildeling';

export const deleteStub = async (_: NextRequest, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;
    TildelingMock.fjernTildeling(pseudoId);
    return new NextResponse(null, { status: 204 });
};
