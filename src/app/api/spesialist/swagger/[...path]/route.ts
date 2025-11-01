import { videresendTilSpesialist } from '@app/api/spesialist/forwarder';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    return videresendTilSpesialist(request);
}
