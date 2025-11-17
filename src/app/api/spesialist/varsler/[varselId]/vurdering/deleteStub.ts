import { NextRequest, NextResponse } from 'next/server';

import { fetchPersondata } from '@spesialist-mock/graphql';
import { Varselstatus } from '@spesialist-mock/schemaTypes';
import { VarselMock } from '@spesialist-mock/storage/varsel';

export const deleteStub = async (_: NextRequest, params: Promise<{ varselId: string }>) => {
    const { varselId } = await params;
    const personer = Object.values(fetchPersondata());
    const funnetVarsel = personer
        .flatMap((it) =>
            it.arbeidsgivere.flatMap((it) => it.generasjoner.flatMap((it) => it.perioder.flatMap((it) => it.varsler))),
        )
        .find((it) => it.id === varselId);
    if (!funnetVarsel) {
        return NextResponse.json({
            code: 'VARSEL_IKKE_FUNNET',
            status: 404,
            title: 'Varsel ikke funnet',
            type: 'about:blank',
        });
    }
    const endring = VarselMock.leggTilEndretVarsel({
        ...funnetVarsel,
        vurdering: {
            status: Varselstatus.Aktiv,
            ident: '',
            tidsstempel: '',
        },
    });
    return new NextResponse(null, { status: endring === 'endret' ? 200 : 204 });
};
