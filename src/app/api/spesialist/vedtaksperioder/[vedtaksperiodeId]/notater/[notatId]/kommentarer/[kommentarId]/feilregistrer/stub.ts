import { NotatMock } from '@spesialist-mock/storage/notat';

export const stub = async (_request: Request, params: Promise<{ notatId: number }>) => {
    const { notatId } = await params;
    NotatMock.feilregistrerKommentar({ id: notatId });
    return new Response(null, { status: 200 });
};
