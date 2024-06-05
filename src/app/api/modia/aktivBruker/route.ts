import { Handling, kallModia } from '@/app/api/modia/modia';
import { hentWonderwallToken } from '@/auth/token';
import logger from '@/logger';

export const dynamic = 'force-dynamic'; // defaults to auto
export const POST = async (req: Request) => {
    const token = hentWonderwallToken(req);
    if (!token) {
        return new Response(null, { status: 401 });
    }
    try {
        await kallModia(Handling.nullstillBruker, token);
        return new Response(null, { status: 200 });
    } catch (error) {
        logger.warn(`Nullstilling av person i modiacontext feilet: ${error}`);
        return new Response(null, { status: 500 });
    }
};
