import { NextRequest } from 'next/server';

import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';

export const stub = async (_: NextRequest) => {
    return Response.json(OpptegnelseMock.sisteSekvensnummer());
};
