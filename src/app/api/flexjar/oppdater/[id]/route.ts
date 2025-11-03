import { erLokal } from '@/env';
import { logger } from '@/logger';
import { postOppdater } from '@app/api/flexjar/flexjar';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    if (erLokal) {
        logger.info(
            `Mocker flexjar lokalt, mottok OPPDATERT feedback: ${JSON.stringify(await request.json(), null, 2)}`,
        );

        return Response.json(
            {
                id: 'fake-lokal-flexjar-id',
            },
            { status: 202 },
        );
    }

    return postOppdater(params.id, request);
}
