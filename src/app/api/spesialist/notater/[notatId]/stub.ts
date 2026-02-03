import { NextResponse } from 'next/server';

import { NotatMock } from '@spesialist-mock/storage/notat';

export const getStub = async (_request: Request, params: Promise<{ notatId: string }>) => {
    const { notatId } = await params;
    const notat = NotatMock.getNotat(Number(notatId));
    return NextResponse.json(notat, { status: 200 });
};

export const patchStub = async (_request: Request, params: Promise<{ notatId: string }>) => {
    const { feilregistrer } = await _request.json();
    if (feilregistrer !== true) {
        NextResponse.json({ detalj: 'Kan ikke fjerne feilregistrering' }, { status: 400 });
    }

    const { notatId } = await params;
    const notat = NotatMock.getNotat(Number(notatId));

    if (notat == undefined || notat.id == undefined) {
        NextResponse.json({ detail: 'Fant ikke notat' }, { status: 404 });
    }

    if (notat?.feilregistrert == false) {
        NotatMock.feilregistrerNotat({ id: notat!.id });
    }

    return NextResponse.json('{}');
};
