import { NextRequest } from 'next/server';

import { hentOpptjeningsvurdering } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';
import { vilkårskodeLabels } from '@form-schemas/manuellVurderingAvVilkårSkjema';
import {
    ApiUtfall,
    ApiVilkårsvurdering,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { Handlingsvisning, Visningsfelt } from '@io/rest/handlingsvisning';

export const stub = async (_request: NextRequest, params: Promise<{ personPseudoId: string; handlingId: string }>) => {
    const { personPseudoId, handlingId } = await params;
    const opptjeningsvurdering = hentOpptjeningsvurdering(personPseudoId, handlingId);
    const vurdering =
        opptjeningsvurdering && 'vurderinger' in opptjeningsvurdering
            ? opptjeningsvurdering.vurderinger.find(erManuellVurdering)
            : undefined;
    // Bare manuelle vurderinger har detaljer
    if (!vurdering) return new Response(null, { status: 404 });
    return Response.json(tilVisning(vurdering));
};

type ManuellVurdering = ApiVilkårsvurdering & { kilde: ApiVurderingskildeSaksbehandler };

function erManuellVurdering(vurdering: ApiVilkårsvurdering): vurdering is ManuellVurdering {
    return 'fritekstbegrunnelse' in vurdering.kilde;
}

function tilVisning({ vilkårskode, utfall, kilde }: ManuellVurdering): Handlingsvisning {
    const felter: Visningsfelt[] = [
        { type: 'TEKST', tittel: 'Vilkår', tekst: vilkårskodeLabels[vilkårskode] },
        { type: 'TEKST', tittel: 'Utfall', tekst: utfall === ApiUtfall.OPPFYLT ? 'Oppfylt' : 'Ikke oppfylt' },
        { type: 'TEKST', tittel: 'Begrunnelse', tekst: kilde.fritekstbegrunnelse },
    ];
    if (kilde.journalpostId.length > 0) {
        felter.push({ type: 'LISTE', tittel: 'Journalposter', elementer: kilde.journalpostId });
    }
    return { felter };
}
