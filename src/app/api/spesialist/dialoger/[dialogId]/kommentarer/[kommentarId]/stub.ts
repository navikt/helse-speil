import { NextResponse } from 'next/server';

import { DialogMock } from '@spesialist-mock/storage/dialog';

export const stub = async (_request: Request, params: Promise<{ dialogId: string; kommentarId: string }>) => {
    const { feilregistrert } = await _request.json();

    if (feilregistrert === false) {
        return NextResponse.json({ detalj: 'Kan ikke fjerne feilregistrering' }, { status: 400 });
    }

    const parameters = await params;

    const dialogId = Number.parseInt(parameters.dialogId);
    const kommentarId = Number.parseInt(parameters.kommentarId);
    const kommentar = DialogMock.getKommentarer(dialogId).find((kommentar) => kommentar.id === kommentarId);

    if (kommentar?.feilregistrert_tidspunkt == null) {
        DialogMock.feilregistrerKommentar(dialogId, kommentarId);
    }

    return NextResponse.json({});
};
