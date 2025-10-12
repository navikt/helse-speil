import { erLokal } from '@/env';
import { forwardToSpesialist } from '@app/api/spesialist/forwarder';

export async function POST(req: Request) {
    if (erLokal) {
        return Response.json(true);
    } else {
        return await forwardToSpesialist(req);
    }
}
