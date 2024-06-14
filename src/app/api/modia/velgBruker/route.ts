import { logger } from '@/logger';
import { Handling, kallModia } from '@app/api/modia/modia';
import { hentWonderwallToken } from '@auth/token';

export const dynamic = 'force-dynamic'; // defaults to auto
export const POST = async (req: Request): Promise<Response> => {
    const token = hentWonderwallToken(req);
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
