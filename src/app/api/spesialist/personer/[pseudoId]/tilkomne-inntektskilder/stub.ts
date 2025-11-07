import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    return Response.json(TilkommenInntektMock.tilkomneInntektskilder(pseudoId));
}
