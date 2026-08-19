import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    return Response.json(GraderteAndreYtelserMock.forPseudoId(pseudoId));
}
