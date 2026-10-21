import { NextRequest } from 'next/server';

import { ApiOppdaterDialogStatus } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

export async function getStub(
    _request: NextRequest,
    params: Promise<{ pseudoId: string; dialogId: string }>,
): Promise<Response> {
    const { pseudoId, dialogId } = await params;
    const dialog = DialogmeldingMock.getByIdForPerson(pseudoId, dialogId);

    if (!dialog) {
        return new Response(null, { status: 404 });
    }

    return Response.json(dialog);
}

export async function postStub(
    request: NextRequest,
    params: Promise<{ pseudoId: string; dialogId: string }>,
): Promise<Response> {
    const { pseudoId, dialogId } = await params;
    const body = await request.json();
    const result = DialogmeldingMock.addSvarForPerson(pseudoId, dialogId, body);

    if (!result) {
        return new Response(null, { status: 404 });
    }

    return Response.json(result);
}

export async function patchStub(
    request: NextRequest,
    params: Promise<{ pseudoId: string; dialogId: string }>,
): Promise<Response> {
    const { pseudoId, dialogId } = await params;
    const data: ApiOppdaterDialogStatus = await request.json();
    const result = DialogmeldingMock.updateStatus(pseudoId, dialogId, data);

    if (!result) {
        return new Response(null, { status: 404 });
    }

    return Response.json(result);
}
