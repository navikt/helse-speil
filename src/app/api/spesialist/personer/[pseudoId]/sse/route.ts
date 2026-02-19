import { NextRequest } from 'next/server';

import { stubEllerVideresendSseTilSpesialist } from '@app/api/spesialist/common';
import { stub } from '@app/api/spesialist/personer/[pseudoId]/sse/stub';

export async function GET(request: NextRequest, context: { params: Promise<{ pseudoId: string }> }) {
    request.headers.set('Accept', 'text/event-stream');
    const response = await stubEllerVideresendSseTilSpesialist<{ pseudoId: string }>(stub)(request, context);
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    const stream = new ReadableStream({
        async start(controller) {
            reader = response?.body?.getReader();
            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                controller.enqueue(value);
            }

            controller.close();
        },
        cancel() {
            reader?.cancel();
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
