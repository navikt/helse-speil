import { logger } from '@navikt/next-logger';

import { Handling, kallModia } from '@app/api/modia/modia';
import { WonderwallError } from '@auth/token';

export const dynamic = 'force-dynamic'; // defaults to auto
export const POST = async (req: Request): Promise<Response> => {
    try {
        const resultat = await kallModia(Handling.velgBrukerIModia, req, await req.text());
        return resultat instanceof WonderwallError
            ? new Response(null, { status: 401 })
            : new Response(null, { status: 200 });
    } catch (error) {
        logger.warn(`Setting av person i modiacontext feilet: ${error}`);
        return new Response(null, { status: 500 });
    }
};
