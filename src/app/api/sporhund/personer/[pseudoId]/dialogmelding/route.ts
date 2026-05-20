import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { ApiNyDialogmelding } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

async function stub(request: NextRequest, params: Promise<{ pseudoId: string }>): Promise<Response> {
    const { pseudoId } = await params;
    const data: ApiNyDialogmelding = await request.json();
    const dialog = DialogmeldingMock.addDialogmelding(pseudoId, data);
    return Response.json(dialog);
}

export const dynamic = 'force-dynamic';

export const POST = stubEllerVideresendTilSporhund(stub);
