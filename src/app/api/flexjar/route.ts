import { logger } from '@navikt/next-logger';

import { erLokal } from '@/env';
import { postOpprett } from '@app/api/flexjar/flexjar';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    if (erLokal) {
        logger.info(`Mocker flexjar lokalt, mottok feedback: ${JSON.stringify(await request.json(), null, 2)}`);
        return Response.json(
            {
                id: 'fake-lokal-flexjar-id',
            },
            { status: 202 },
        );
    }

    return postOpprett(request);
}
