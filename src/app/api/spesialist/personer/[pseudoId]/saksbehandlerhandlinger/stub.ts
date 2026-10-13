import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';

export async function stub(_request: Request, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    return Response.json(SaksbehandlerhandlingMock.hentHandlinger(pseudoId));
}
