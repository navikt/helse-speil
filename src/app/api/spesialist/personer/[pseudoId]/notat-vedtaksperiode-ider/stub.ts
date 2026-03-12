import { NotatMock } from '@spesialist-mock/storage/notat';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    return Response.json(NotatMock.getNotatVedtaksperiodeIderForPerson(pseudoId));
}
