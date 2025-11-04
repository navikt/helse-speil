import { erLokal } from '@/env';
import { logger } from '@/logger';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { sleep } from '@spesialist-mock/constants';

export const stubEllerVideresendTilSpesialist =
    <Params>(stub: (request: Request, params: Promise<Params>) => Promise<Response>) =>
    async (request: Request, { params }: { params: Promise<Params> }) => {
        if (erLokal) {
            logger.info(`Svarer på ${request.method} ${request.url} med stub`);
            await sleep(500 + Math.random() * 500);
            return stub(request, params);
        } else {
            return videresendTilSpesialist(request);
        }
    };
