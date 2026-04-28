import { logger } from '@navikt/next-logger';

type Params = { vedtaksperiodeId: string };

export const stub = async (_request: Request, params: Promise<Params>) => {
    const { vedtaksperiodeId } = await params;
    logger.info(`Mock: Forkaster vedtaksperiode ${vedtaksperiodeId}"`);
    return Math.random() < 0.5 ? new Response(null, { status: 204 }) : new Response(null, { status: 500 });
};
