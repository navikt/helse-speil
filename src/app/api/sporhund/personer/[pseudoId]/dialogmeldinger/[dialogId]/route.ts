import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { ApiOppdaterDialogStatus } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

async function getStub(
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

async function postStub(
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

async function patchStub(
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

export const dynamic = 'force-dynamic';

export const GET = stubEllerVideresendTilSporhund(getStub);
export const POST = stubEllerVideresendTilSporhund(postStub);
export const PATCH = stubEllerVideresendTilSporhund(patchStub);
