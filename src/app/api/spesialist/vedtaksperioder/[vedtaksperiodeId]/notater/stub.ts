import { NextResponse } from 'next/server';

import { NotatMock } from '@spesialist-mock/storage/notat';

export const stub = async (_request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;

    return NextResponse.json(NotatMock.getNotaterForVedtaksperiode(vedtaksperiodeId));
};
