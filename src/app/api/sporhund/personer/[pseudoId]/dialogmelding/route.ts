import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { ApiNyDialogmelding } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';

const stub = async (request: NextRequest): Promise<Response> => {
    const data: ApiNyDialogmelding = await request.json();
    const dialog = DialogmeldingMock.addDialogmelding(data);
    return Response.json(dialog);
};

export const dynamic = 'force-dynamic';

export const POST = stubEllerVideresendTilSporhund(stub);
