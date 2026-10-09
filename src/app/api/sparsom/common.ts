import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import { backend } from '@/env';
import { videresendTilSparsom } from '@app/api/sparsom/videresender';
import { sleep } from '@spesialist-mock/constants';

export const stubEllerVideresendTilSparsom =
    <Params>(stub: (request: NextRequest, params: Promise<Params>) => Promise<Response>) =>
    async (request: NextRequest, { params }: { params: Promise<Params> }) => {
        if (backend === 'mock') {
            logger.info(`Svarer på ${request.method} ${request.url} med stub`);
            await sleep(50 + Math.random() * 500);
            return stub(request, params);
        } else {
            return videresendTilSparsom(request);
        }
    };
