import { erLokal } from '@/env';
import { logger } from '@/logger';
import { forwardGETtoSpesialist } from '@app/api/spesialist/forwarder';
import { sleep } from '@spesialist-mock/constants';
import { DokumentMock } from '@spesialist-mock/storage/dokument';

export async function GET(req: Request): Promise<Response> {
    if (erLokal) {
        logger.info('Mocker søknad lokalt');
        await sleep(1000);
        return Response.json(DokumentMock.getMockedSoknad());
    } else {
        return await forwardGETtoSpesialist(req);
    }
}
