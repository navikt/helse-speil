import { erLokal } from '@/env';
import { logger } from '@/logger';
import { forwardGETtoSpesialist } from '@app/api/spesialist/forwarder';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function GET(req: Request, { params }: { params: Promise<{ aktorId: string }> }) {
    const { aktorId } = await params;

    if (erLokal) {
        logger.info(`Mocker tilkomne inntekter lokalt`);
        await sleep(1000);
        return Response.json(TilkommenInntektMock.tilkomneInntektskilder(aktorId));
    } else {
        return await forwardGETtoSpesialist(req);
    }
}
