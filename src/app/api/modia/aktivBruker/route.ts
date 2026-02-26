import { logger } from '@navikt/next-logger';

import { Handling, kallModia } from '@app/api/modia/modia';
import { WonderwallError } from '@auth/token';

export const dynamic = 'force-dynamic'; // defaults to auto
export const DELETE = async (req: Request): Promise<Response> => {
    try {
        const resultat = await kallModia(Handling.nullstillBruker, req);
        if (resultat instanceof WonderwallError) return new Response(null, { status: 401 });
        else return new Response(null, { status: 200 });
    } catch (error) {
        logger.warn(`Nullstilling av person i modiacontext feilet: ${error}`);
        return new Response(null, { status: 500 });
    }
};
