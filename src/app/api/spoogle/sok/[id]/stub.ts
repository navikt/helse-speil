import { NextRequest } from 'next/server';

import { SpoogleNode, SpoogleSøkResponse } from '@io/rest/spoogle';
import { lesTestpersonfiler } from '@spesialist-mock/storage/person';

const node = (id: string, type: string, children: SpoogleNode[] = []): SpoogleNode => ({
    id,
    type,
    children,
    ugyldig_fra: null,
});

export async function stub(_request: NextRequest, params: Promise<{ id: string }>) {
    const { id } = await params;

    for (const { saksbilde } of lesTestpersonfiler()) {
        const { fodselsnummer, arbeidsgivere } = saksbilde;
        for (const arbeidsgiver of arbeidsgivere) {
            const perioder = arbeidsgiver.behandlinger.flatMap((behandling) => behandling.perioder);
            const periode = perioder.find((it) => it.vedtaksperiodeId === id || it.behandlingId === id);
            if (!periode) continue;

            const behandlingIder = [
                ...new Set(
                    perioder
                        .filter((it) => it.vedtaksperiodeId === periode.vedtaksperiodeId)
                        .map((it) => it.behandlingId),
                ),
            ];
            const vedtaksperiode = node(
                periode.vedtaksperiodeId,
                'VEDTAKSPERIODE_ID',
                behandlingIder.map((behandlingId) => node(behandlingId, 'BEHANDLING_ID')),
            );
            const organisasjon = node(arbeidsgiver.organisasjonsnummer, 'ORGANISASJONSNUMMER', [vedtaksperiode]);
            const person = node(fodselsnummer, 'FØDSELSNUMMER', [organisasjon]);
            const stiTilPeriode = [fodselsnummer, arbeidsgiver.organisasjonsnummer, periode.vedtaksperiodeId];
            return Response.json({
                tree: person,
                path: id === periode.vedtaksperiodeId ? stiTilPeriode : [...stiTilPeriode, id],
            } satisfies SpoogleSøkResponse);
        }
    }

    return new Response(null, { status: 404 });
}
