import { NextRequest } from 'next/server';

import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            const opptegnelser = OpptegnelseMock.hentOpptegnelserEtter(-1, pseudoId);

            opptegnelser.forEach((opptegnelse, i) => {
                const data = `data: ${JSON.stringify(opptegnelse)}\n\n`;
                setTimeout(() => controller.enqueue(encoder.encode(data)), (i + 1) * 2000);
            });
        },
        cancel() {},
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    });
}
