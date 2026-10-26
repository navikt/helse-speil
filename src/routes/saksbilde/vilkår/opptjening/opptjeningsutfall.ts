import {
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVurderingskilde,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { Vilkårsutfall } from '@saksbilde/vilkår/vilkårsutfall';

export interface Opptjeningsvilkår {
    arbeid?: ApiVilkårsvurdering;
    første?: ApiVilkårsvurdering;
    andre?: ApiVilkårsvurdering;
    tredje?: ApiVilkårsvurdering;
}

interface UtledetUtfall {
    utfall: Vilkårsutfall;
    hjemmel?: string;
}

// Scenario A–E i docs/opptjening-8-2-kodeverk.md i sp-vilkarsproving, likt avgjørendeVilkårsvurdering() der
export function utledOpptjening({ arbeid, første, andre, tredje }: Opptjeningsvilkår): UtledetUtfall {
    if (arbeid && erOppfylt(arbeid)) return { utfall: 'Oppfylt', hjemmel: '§ 8-2 første ledd' };
    if (første) return utledAndreLedd(første, andre, tredje);
    if (arbeid) return { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 første ledd' };
    return { utfall: 'IkkeVurdert' };
}

function utledAndreLedd(
    første: ApiVilkårsvurdering,
    andre?: ApiVilkårsvurdering,
    tredje?: ApiVilkårsvurdering,
): UtledetUtfall {
    if (!erOppfylt(første)) return { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd første punktum' };
    if (!andre || erOppfylt(andre)) return { utfall: 'Oppfylt', hjemmel: '§ 8-2 andre ledd første punktum' };
    if (!tredje) return { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd andre punktum' };
    return erOppfylt(tredje)
        ? { utfall: 'Oppfylt', hjemmel: '§ 8-2 andre ledd tredje punktum' }
        : { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd andre punktum, jf. tredje punktum' };
}

export function opptjeningsvilkår(
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined,
): Opptjeningsvilkår {
    return {
        arbeid: vurderingFor(ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER),
        første: vurderingFor(ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER),
        andre: vurderingFor(ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP),
        tredje: vurderingFor(ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER),
    };
}

export function vurderingForVisning({ arbeid, første }: Opptjeningsvilkår): ApiVilkårsvurdering | undefined {
    return arbeid ?? første;
}

// Automatisk oppfylt opptjening skal ikke vurderes manuelt
export function erAutomatiskOppfylt(vilkår: Opptjeningsvilkår): boolean {
    const vurdering = vurderingForVisning(vilkår);
    return utledOpptjening(vilkår).utfall === 'Oppfylt' && !!vurdering && !erSaksbehandlerkilde(vurdering.kilde);
}

export function erOppfylt(vurdering: ApiVilkårsvurdering): boolean {
    return vurdering.utfall === ApiUtfall.OPPFYLT;
}

export function erSaksbehandlerkilde(kilde: ApiVurderingskilde): kilde is ApiVurderingskildeSaksbehandler {
    return 'ident' in kilde;
}
