import { erLokal } from '@/env';
import { logger } from '@/logger';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function GET(req: Request, { params }: { params: Promise<{ aktorId: string }> }) {
    if (erLokal) {
        logger.info(`Mocker tilkomne inntekter lokalt`);
        const { aktorId } = await params;
        await sleep(1000);
        return Response.json(TilkommenInntektMock.tilkomneInntektskilder(aktorId));
    } else {
        return videresendTilSpesialist(req);
    }
}
