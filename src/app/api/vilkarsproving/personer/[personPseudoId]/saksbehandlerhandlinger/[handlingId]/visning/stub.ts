import { NextRequest } from 'next/server';

import { hentOpptjeningsvurdering } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';
import { opptjeningsaktivitetLabels } from '@form-schemas/opptjeningsvurderingSkjema';
import {
    ApiOpptjeningsaktivitet,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { Handlingsvisning, Visningsfelt } from '@io/rest/handlingsvisning';

export const stub = async (_request: NextRequest, params: Promise<{ personPseudoId: string; handlingId: string }>) => {
    const { personPseudoId, handlingId } = await params;
    const opptjeningsvurdering = hentOpptjeningsvurdering(personPseudoId, handlingId);
    const manuelle =
        opptjeningsvurdering && 'vurderinger' in opptjeningsvurdering
            ? opptjeningsvurdering.vurderinger.filter(erManuellVurdering)
            : [];
    // Bare manuelle vurderinger har detaljer
    if (manuelle.length === 0) return new Response(null, { status: 404 });
    return Response.json(tilVisning(nyesteHandling(manuelle)));
};

type ManuellVurdering = ApiVilkårsvurdering & { kilde: ApiVurderingskildeSaksbehandler };

function erManuellVurdering(vurdering: ApiVilkårsvurdering): vurdering is ManuellVurdering {
    return 'fritekstbegrunnelse' in vurdering.kilde;
}

// Vurderinger fra samme skjema lagres sammen i én handling med samme tidspunkt
function nyesteHandling(manuelle: ManuellVurdering[]): ManuellVurdering[] {
    const nyesteTidspunkt = manuelle
        .map((vurdering) => vurdering.vurdertTidspunkt)
        .sort()
        .at(-1);
    return manuelle.filter((vurdering) => vurdering.vurdertTidspunkt === nyesteTidspunkt);
}

function tilVisning(vurderinger: ManuellVurdering[]): Handlingsvisning {
    const { kilde } = vurderinger[0]!;
    const felter: Visningsfelt[] = vurderinger
        .toSorted((a, b) => vilkårsrekkefølge(a.vilkårskode) - vilkårsrekkefølge(b.vilkårskode))
        .map((vurdering) => ({
            type: 'TEKST',
            tittel: vilkårskodeLabels[vurdering.vilkårskode],
            tekst: utfallstekst(vurdering.utfall),
        }));
    // Bare arbeid følger av at «Arbeid i minst 4 uker» er oppfylt, så lista vises bare når det er likestilte ytelser
    if (kilde.opptjeningsaktiviteter.some((aktivitet) => aktivitet !== ApiOpptjeningsaktivitet.ARBEID)) {
        felter.push({
            type: 'LISTE',
            tittel: 'Arbeid og likestilte ytelser',
            elementer: kilde.opptjeningsaktiviteter.map((aktivitet) => opptjeningsaktivitetLabels[aktivitet]),
        });
    }
    felter.push({ type: 'TEKST', tittel: 'Begrunnelse', tekst: kilde.fritekstbegrunnelse });
    if (kilde.journalpostId.length > 0) {
        felter.push({ type: 'LISTE', tittel: 'Journalposter', elementer: kilde.journalpostId });
    }
    return { felter };
}

function utfallstekst(utfall: ApiUtfall): string {
    return utfall === ApiUtfall.OPPFYLT ? 'Oppfylt' : 'Ikke oppfylt';
}

function vilkårsrekkefølge(vilkårskode: ApiVilkårskode): number {
    return Object.values(ApiVilkårskode).indexOf(vilkårskode);
}

const vilkårskodeLabels: Record<ApiVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'Arbeid i minst 4 uker',
    [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER]: 'Likestilt ytelse i minst 4 uker',
    [ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP]: 'Foreldrepenger ikke opptjent på AAP',
    [ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER]:
        'Yrkesaktiv i minst 4 uker før uttak av foreldrepenger',
};
