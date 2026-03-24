import { NextRequest, NextResponse } from 'next/server';

import { PaVentMock } from '@spesialist-mock/storage/påvent';

export const deleteStub = async (_: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    PaVentMock.fjernPåVent(oppgaveId);
    return new NextResponse(null, { status: 204 });
};
