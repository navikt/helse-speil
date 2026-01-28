import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { sleep } from '@spesialist-mock/constants';

export const stubEllerVideresendTilSpesialist =
    <Params>(stub: (request: NextRequest, params: Promise<Params>) => Promise<Response>) =>
    async (request: NextRequest, { params }: { params: Promise<Params> }) => {
        if (erLokal) {
            logger.info(`Svarer på ${request.method} ${request.url} med stub`);
            // Delay på 500-1000ms for å se skeletons og loading-logikk i tilfeldig rekkefølge
            await sleep(500 + Math.random() * 500);
            return stub(request, params);
        } else {
            return videresendTilSpesialist(request);
        }
    };
