import { NextRequest, NextResponse } from 'next/server';

import { ApiSaksbildeVarselstatus, ApiVarselvurdering } from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerIdent } from '@spesialist-mock/constants';
import { fetchPersondata } from '@spesialist-mock/saksbilde';
import { alleBehandlinger } from '@spesialist-mock/storage/person';
import { VarselMock } from '@spesialist-mock/storage/varsel';

export const putStub = async (request: NextRequest, params: Promise<{ varselId: string }>) => {
    const { varselId } = await params;
    const { definisjonId }: ApiVarselvurdering = await request.json();
    const personer = Object.values(fetchPersondata());
    const funnetVarsel = personer
        .flatMap((it) => alleBehandlinger(it).flatMap((it) => it.perioder.flatMap((it) => it.varsler)))
        .find((it) => it.id === varselId);
    if (funnetVarsel == undefined) {
        return NextResponse.json(
            {
                code: 'VARSEL_IKKE_FUNNET',
                title: 'Varsel ikke funnet',
                type: 'about:blank',
            },
            {
                status: 404,
            },
        );
    }
    const endring = VarselMock.leggTilEndretVarsel({
        ...funnetVarsel,
        definisjonId: definisjonId,
        vurdering: {
            status: ApiSaksbildeVarselstatus.VURDERT,
            ident: lokalSaksbehandlerIdent,
            tidsstempel: new Date().toISOString(),
        },
    });
    return new NextResponse(null, { status: endring === 'endret' ? 200 : 204 });
};
