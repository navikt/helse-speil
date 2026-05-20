import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>): Promise<Response> {
    const { pseudoId } = await params;
    return Response.json(DialogmeldingMock.getAllForPerson(pseudoId));
}

export const dynamic = 'force-dynamic';

export const GET = stubEllerVideresendTilSporhund(stub);
