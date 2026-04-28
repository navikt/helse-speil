import { logger } from '@navikt/next-logger';

export const stub = async (_request: Request) => {
    const { vedtaksperiodeId } = await _request.json();
    logger.info(`Mock: Forkaster vedtaksperiode ${vedtaksperiodeId}"`);
    return Math.random() < 0.5 ? new Response(null, { status: 204 }) : new Response(null, { status: 500 });
};
