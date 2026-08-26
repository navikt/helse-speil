import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import { ServerSentEventsMock } from '@spesialist-mock/storage/events';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;

    const encoder = new TextEncoder();
    let antallSendteEventer = 0;
    let intervall: ReturnType<typeof setInterval> | undefined;

    const stream = new ReadableStream({
        start(controller) {
            logger.info(`Stream started - personPseudoId: ${pseudoId}`);

            // Poller for nye eventer, slik at eventer som pushes etter at streamen ble åpnet
            // (f.eks. fra overstyrings-stubber som pusher eventer med forsinkelse) også sendes.
            intervall = setInterval(() => {
                const events = ServerSentEventsMock.hentEventsFor(pseudoId);
                const nyeEventer = events.slice(antallSendteEventer);
                antallSendteEventer = events.length;

                nyeEventer.forEach((event) => {
                    const data = `event: ${event.event}\ndata: {}\n\n`;
                    try {
                        logger.info(`Sender ${data}`);
                        controller.enqueue(encoder.encode(data));
                    } catch {
                        logger.info('Controller is closed');
                    }
                });
            }, 500);
        },
        cancel() {
            if (intervall) clearInterval(intervall);
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
