import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';

export async function POST(req: Request) {
    if (erLokal) {
        return new Response(null, { status: 204 });
    } else {
        return videresendTilSpesialist(req);
    }
}
