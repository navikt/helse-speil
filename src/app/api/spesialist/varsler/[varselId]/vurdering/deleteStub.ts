import { NextRequest, NextResponse } from 'next/server';

import { ApiSaksbildeVarselstatus } from '@io/rest/generated/spesialist.schemas';
import { fetchPersondata } from '@spesialist-mock/saksbilde';
import { alleBehandlinger } from '@spesialist-mock/storage/person';
import { VarselMock } from '@spesialist-mock/storage/varsel';

export const deleteStub = async (_: NextRequest, params: Promise<{ varselId: string }>) => {
    const { varselId } = await params;
    const personer = Object.values(fetchPersondata());
    const funnetVarsel = personer
        .flatMap((it) => alleBehandlinger(it).flatMap((it) => it.perioder.flatMap((it) => it.varsler)))
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
            status: ApiSaksbildeVarselstatus.AKTIV,
            ident: '',
            tidsstempel: '',
        },
    });
    return new NextResponse(null, { status: endring === 'endret' ? 200 : 204 });
};
