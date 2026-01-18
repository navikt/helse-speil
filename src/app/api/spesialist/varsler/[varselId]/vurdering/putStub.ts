import { NextRequest, NextResponse } from 'next/server';

import { PutVarselvurderingMutationBody } from '@io/rest/generated/varsler/varsler';
import { fetchPersondata } from '@spesialist-mock/graphql';
import { Varselstatus } from '@spesialist-mock/schemaTypes';
import { VarselMock } from '@spesialist-mock/storage/varsel';

export const putStub = async (request: NextRequest, params: Promise<{ varselId: string }>) => {
    const { varselId } = await params;
    const { definisjonId }: PutVarselvurderingMutationBody = await request.json();
    const personer = Object.values(fetchPersondata());
    const funnetVarsel = personer
        .flatMap((it) =>
            it.arbeidsgivere.flatMap((it) => it.behandlinger.flatMap((it) => it.perioder.flatMap((it) => it.varsler))),
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
        definisjonId: definisjonId,
        vurdering: {
            status: Varselstatus.Vurdert,
            ident: 'A123456',
            tidsstempel: new Date().toISOString(),
        },
    });
    return new NextResponse(null, { status: endring === 'endret' ? 200 : 204 });
};
