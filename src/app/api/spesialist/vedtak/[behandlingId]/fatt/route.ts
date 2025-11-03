import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';

export async function POST(req: Request) {
    if (erLokal) {
        return Response.json(null);
    } else {
        return await videresendTilSpesialist(req);
    }
}
