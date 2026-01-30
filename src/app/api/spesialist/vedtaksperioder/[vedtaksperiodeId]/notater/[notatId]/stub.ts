import { NextResponse } from 'next/server';

import { NotatMock } from '@spesialist-mock/storage/notat';

export const stub = async (_request: Request, params: Promise<{ vedtaksperiodeId: string; notatId: string }>) => {
    const { notatId } = await params;
    const notat = NotatMock.getNotat(Number(notatId));
    return NextResponse.json(notat, { status: 200 });
};
