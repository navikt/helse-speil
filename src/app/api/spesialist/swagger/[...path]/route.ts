import { videresendTilSpesialist } from '@app/api/spesialist/videresender';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    return videresendTilSpesialist(request);
}
