import { NextRequest } from 'next/server';

import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>): Promise<Response> {
    const { pseudoId } = await params;
    return Response.json(DialogmeldingMock.getAllForPerson(pseudoId));
}
