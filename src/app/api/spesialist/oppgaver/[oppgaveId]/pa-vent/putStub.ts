import { NextRequest, NextResponse } from 'next/server';

import { PutPåVentMutationBody } from '@io/rest/generated/oppgaver/oppgaver';
import { PaVentMock } from '@spesialist-mock/storage/påvent';

export const putStub = async (request: NextRequest, params: Promise<{ oppgaveId: string }>) => {
    const { oppgaveId } = await params;
    const { frist }: PutPåVentMutationBody = await request.json();
    PaVentMock.setPåVent(oppgaveId, { frist: frist, oid: '11111111-2222-3333-4444-555555555555' });

    return new NextResponse(null, { status: 204 });
};
