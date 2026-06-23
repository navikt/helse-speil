import { NextRequest } from 'next/server';

import { behandlingsstatistikk } from '@spesialist-mock/data/behandlingsstatistikk';

export async function stub(_request: NextRequest) {
    return Response.json(behandlingsstatistikk);
}
