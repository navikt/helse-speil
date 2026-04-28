import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import { ServerSentEventsMock } from '@spesialist-mock/storage/events';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;

    const encoder = new TextEncoder();
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const stream = new ReadableStream({
        start(controller) {
            logger.info(`Stream started - personPseudoId: ${pseudoId}`);
            const events = ServerSentEventsMock.hentEventsFor(pseudoId);

            events.forEach((event, i) => {
                const data = `event: ${event.event}\ndata: {}\n\n`;
                const timeout = setTimeout(
                    () => {
                        try {
                            logger.info(`Sender ${data}`);
                            controller.enqueue(encoder.encode(data));
                        } catch {
                            logger.info('Controller is closed');
                        }
                    },
                    (i + 1) * 2000,
                );
                timeouts.push(timeout);
            });
        },
        cancel() {
            timeouts.forEach(clearTimeout);
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}
