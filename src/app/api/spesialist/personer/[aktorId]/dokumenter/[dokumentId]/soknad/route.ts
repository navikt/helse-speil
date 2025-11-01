import { erLokal } from '@/env';
import { logger } from '@/logger';
import { videresendTilSpesialist } from '@app/api/spesialist/forwarder';
import { sleep } from '@spesialist-mock/constants';
import { DokumentMock } from '@spesialist-mock/storage/dokument';

export async function GET(req: Request): Promise<Response> {
    if (erLokal) {
        logger.info('Mocker søknad lokalt');
        await sleep(1000);
        if (Math.random() > 0.9) return Response.error();
        else return Response.json(DokumentMock.getMockedSoknad());
    } else {
        return videresendTilSpesialist(req);
    }
}
