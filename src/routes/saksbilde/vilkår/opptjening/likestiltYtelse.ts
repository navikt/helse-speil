import { ApiUtfall, ApiVilkårskode, ApiVilkårsvurdering } from '@io/rest/generated/vilkarsproving.schemas';
import { Vilkårsutfall } from '@saksbilde/vilkår/vilkårsutfall';

const likestiltYtelseVilkårskoder: ApiVilkårskode[] = [
    ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER,
    ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP,
    ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER,
];

export interface Punktumvurderinger {
    første?: ApiVilkårsvurdering;
    andre?: ApiVilkårsvurdering;
    tredje?: ApiVilkårsvurdering;
}

// Scenario B–E i docs/opptjening-8-2-kodeverk.md i sp-vilkarsproving, likt avgjørendeVilkårsvurdering() der
export function utledLikestiltYtelse({ første, andre, tredje }: Punktumvurderinger): {
    utfall: Vilkårsutfall;
    hjemmel?: string;
} {
    if (!første) return { utfall: 'IkkeVurdert' };
    if (!erOppfylt(første)) return { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd første punktum' };
    if (!andre || erOppfylt(andre)) return { utfall: 'Oppfylt', hjemmel: '§ 8-2 andre ledd første punktum' };
    if (!tredje) return { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd andre punktum' };
    return erOppfylt(tredje)
        ? { utfall: 'Oppfylt', hjemmel: '§ 8-2 andre ledd tredje punktum' }
        : { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd andre punktum, jf. tredje punktum' };
}

export function punktumvurderinger(
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined,
): Punktumvurderinger {
    return {
        første: vurderingFor(ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER),
        andre: vurderingFor(ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP),
        tredje: vurderingFor(ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER),
    };
}

export function erLikestiltYtelse(vilkårskode?: ApiVilkårskode): boolean {
    return !!vilkårskode && likestiltYtelseVilkårskoder.includes(vilkårskode);
}

export function erOppfylt(vurdering: ApiVilkårsvurdering): boolean {
    return vurdering.utfall === ApiUtfall.OPPFYLT;
}
