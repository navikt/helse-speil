import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import { backend } from '@/env';
import { videresendTilVilkarsproving } from '@app/api/vilkarsproving/videresender';
import { sleep } from '@spesialist-mock/constants';

export const stubEllerVideresendTilVilkarsproving =
    <Params>(stub: (request: NextRequest, params: Promise<Params>) => Promise<Response>) =>
    async (request: NextRequest, { params }: { params: Promise<Params> }) => {
        if (backend === 'mock' || backend === 'lokal-vilkarsproving') {
            logger.info(`Svarer på ${request.method} ${request.url} med stub`);
            await sleep(50 + Math.random() * 500);
            return stub(request, params);
        } else {
            return videresendTilVilkarsproving(request);
        }
    };
