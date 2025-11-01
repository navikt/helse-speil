import { NextRequest } from 'next/server';

import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { oppgaveliste } from '@spesialist-mock/data/oppgaveoversikt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    if (erLokal) {
        return Response.json(oppgaveliste(req.nextUrl.searchParams));
    } else {
        return videresendTilSpesialist(req);
    }
}
