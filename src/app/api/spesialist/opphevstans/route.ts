import { erLokal } from '@/env';
import { forwardPOSTtoSpesialist } from '@app/api/spesialist/forwarder';

export async function POST(req: Request) {
    const requestBody = await req.json();

    if (erLokal) {
        return Response.json(true);
    } else {
        return await forwardPOSTtoSpesialist(req, requestBody);
    }
}
