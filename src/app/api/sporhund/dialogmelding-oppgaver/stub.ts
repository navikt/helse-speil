import { NextRequest } from 'next/server';

import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

export async function stub(_request: NextRequest): Promise<Response> {
    return Response.json(DialogmeldingMock.getAllForOppgaver());
}
