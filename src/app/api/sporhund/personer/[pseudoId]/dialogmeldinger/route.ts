import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

async function stub(_request: NextRequest): Promise<Response> {
    return Response.json(DialogmeldingMock.getAll());
}

export const dynamic = 'force-dynamic';

export const GET = stubEllerVideresendTilSporhund(stub);
