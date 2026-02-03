import { NextResponse } from 'next/server';

import { DialogMock } from '@spesialist-mock/storage/dialog';

export const stub = async (_request: Request, params: Promise<{ dialogId: string }>) => {
    const { tekst } = await _request.json();
    const { dialogId } = await params;

    const kommentar = DialogMock.addKommentar(Number.parseInt(dialogId), { tekst });

    return NextResponse.json({ id: kommentar.id }, { status: 201 });
};
