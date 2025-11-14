import { NextResponse } from 'next/server';

import { VarselMock } from '@spesialist-mock/storage/varsel';

export const stub = async (_request: Request, params: Promise<{ varselId: string }>) => {
    const { varselId } = await params;
    const varsel = VarselMock.getVarsel(varselId);
    return NextResponse.json(varsel, { status: 200 });
};
