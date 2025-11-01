import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';

export async function POST(req: Request) {
    if (erLokal) {
        return Response.json(true);
    } else {
        return videresendTilSpesialist(req);
    }
}
