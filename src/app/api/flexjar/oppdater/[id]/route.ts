import { erLokal } from '@/env';
import { logger } from '@/logger';
import { postOppdater } from '@app/api/flexjar/flexjar';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    if (erLokal) {
        logger.info(`Mocker flexjar lokalt, mottok OPPDATERT feedback: ${JSON.stringify(request.json(), null, 2)}`);

        return Response.json({
            id: 'fake-lokal-flexjar-id',
        });
    }

    return postOppdater(params.id, request);
}
