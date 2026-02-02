import { NextResponse } from 'next/server';

import { NotatType } from '@spesialist-mock/schemaTypes';
import { NotatMock } from '@spesialist-mock/storage/notat';

export const stub = async (_request: Request) => {
    const { tekst, vedtaksperiodeId } = await _request.json();
    const notat = NotatMock.addNotat(vedtaksperiodeId, { tekst, type: NotatType.Generelt });
    return NextResponse.json({ id: notat.id }, { status: 200 });
};
