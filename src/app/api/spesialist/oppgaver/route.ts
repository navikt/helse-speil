import { NextRequest } from 'next/server';

import { erLokal } from '@/env';
import { forwardGETtoSpesialist } from '@app/api/spesialist/forwarder';
import { oppgaveliste } from '@spesialist-mock/data/oppgaveoversikt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    if (erLokal) {
        return Response.json(oppgaveliste(req.nextUrl.searchParams));
    } else {
        return await forwardGETtoSpesialist(req);
    }
}
