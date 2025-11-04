import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function stub(_request: Request, params: Promise<{ aktorId: string }>) {
    const { aktorId } = await params;
    return Response.json(TilkommenInntektMock.tilkomneInntektskilder(aktorId));
}
