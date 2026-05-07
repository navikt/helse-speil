import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { testBehandlere } from '@saksbilde/dialogmelding/testdata';

const stub = async (_request: NextRequest): Promise<Response> => {
    return Response.json(testBehandlere);
};

export const dynamic = 'force-dynamic';

export const POST = stubEllerVideresendTilSporhund(stub);
