import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/forwarder';

export async function POST(req: Request) {
    if (erLokal) {
        return Response.json(true);
    } else {
        return videresendTilSpesialist(req);
    }
}
