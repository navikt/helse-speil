import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

async function stub(request: NextRequest, params: Promise<{ dialogId: string }>): Promise<Response> {
    const { dialogId } = await params;
    const body = await request.json();
    const result = DialogmeldingMock.addSvar(dialogId, body);

    if (!result) {
        return new Response(null, { status: 404 });
    }

    return Response.json(result);
}

export const dynamic = 'force-dynamic';

export const POST = stubEllerVideresendTilSporhund(stub);
