import { NextResponse } from 'next/server';

import { ApiNotatType } from '@io/rest/generated/spesialist.schemas';
import { NotatMock } from '@spesialist-mock/storage/notat';

export const stub = async (_request: Request) => {
    const { tekst, vedtaksperiodeId } = await _request.json();
    const notat = NotatMock.addNotat(vedtaksperiodeId, { tekst, type: ApiNotatType.Generelt });
    return NextResponse.json({ id: notat.id }, { status: 200 });
};
