import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function stub(_request: Request, params: Promise<{ aktorId: string }>) {
    const { aktorId } = await params;
    await sleep(1000);
    return Response.json(TilkommenInntektMock.tilkomneInntektskilder(aktorId));
}
