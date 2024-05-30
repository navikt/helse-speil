import { getToken } from '@navikt/oasis';

import { Handling, kallModia } from '@/app/api/modia/modia';
import logger from '@/logger';

export const POST = async (req: Request) => {
    const token = getToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }
    try {
        await kallModia(Handling.velgBrukerIModia, token, await req.text());
        return new Response(null, { status: 200 });
    } catch (error) {
        logger.warn(`Setting av person i modiacontext feilet: ${error}`);
        return new Response(null, { status: 500 });
    }
};
