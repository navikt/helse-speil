import { NextRequest } from 'next/server';

import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;

    const encoder = new TextEncoder();
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const stream = new ReadableStream({
        start(controller) {
            const opptegnelser = OpptegnelseMock.hentOpptegnelserEtter(-1, pseudoId);

            opptegnelser.forEach((opptegnelse, i) => {
                const data = `event: ${opptegnelse.type}\ndata: {}\n\n`;
                const timeout = setTimeout(
                    () => {
                        try {
                            controller.enqueue(encoder.encode(data));
                        } catch {
                            // Controller is already closed, ignore
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
