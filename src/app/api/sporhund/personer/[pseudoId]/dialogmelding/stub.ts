import { NextRequest } from 'next/server';

import { ApiNyDialogmelding } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

export async function stub(request: NextRequest, params: Promise<{ pseudoId: string }>): Promise<Response> {
    const { pseudoId } = await params;
    const data: ApiNyDialogmelding = await request.json();
    const dialog = DialogmeldingMock.addDialogmelding(pseudoId, data);
    return Response.json(dialog);
}
