import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

async function stub(_request: NextRequest, params: Promise<{ pseudoId: string; dialogId: string }>): Promise<Response> {
    const { pseudoId, dialogId } = await params;
    const result = DialogmeldingMock.addBehandlerSvarForPerson(pseudoId, dialogId);

    if (!result) {
        return new Response(null, { status: 404 });
    }

    return Response.json(result);
}

export const dynamic = 'force-dynamic';

export const POST = stubEllerVideresendTilSporhund(stub);
