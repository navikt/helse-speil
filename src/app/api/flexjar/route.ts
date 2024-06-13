import { erLokal } from '@/env';
import { logger } from '@/logger';
import { postOpprett } from '@app/api/flexjar/flexjar';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    if (erLokal) {
        logger.info(`Mocker flexjar lokalt, mottok feedback: ${JSON.stringify(request.json(), null, 2)}`);
        return Response.json({
            id: 'fake-lokal-flexjar-id',
        });
    }

    return postOpprett(request);
}
