import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

async function stub(_request: NextRequest, params: Promise<{ dialogId: string }>): Promise<Response> {
    const { dialogId } = await params;
    const dialog = DialogmeldingMock.getById(dialogId);

    if (!dialog) {
        return new Response(null, { status: 404 });
    }

    return Response.json(dialog);
}

export const dynamic = 'force-dynamic';

export const GET = stubEllerVideresendTilSporhund(stub);
