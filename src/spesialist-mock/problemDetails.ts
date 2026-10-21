import { logger } from '@navikt/next-logger';

export function problemDetails<Code extends string>(status: number, code: Code, title: string): Response {
    logger.info(`Stub svarer med feil ${status} ${code}`);
    return Response.json({ type: 'about:blank', status, title, code }, { status });
}
