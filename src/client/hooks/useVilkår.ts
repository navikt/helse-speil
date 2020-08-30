import { ReactNode, useContext } from 'react';
import { PersonContext } from '../context/PersonContext';
import { Vilkårstype, VurdertVilkår } from '../context/mapping/vilkår';
import { IkkeVurdertVilkår } from '../routes/Saksbilde/Vilkår/Vilkårsgrupper/IkkeVurderteVilkår';
import { Vilkårdata } from '../routes/Saksbilde/Vilkår/Vilkår';
import { Opptjening, Vilkår } from '../context/types.internal';
import {
    alder,
    dagerIgjen,
    kravTilSykepengegrunnlag,
    opptjeningstid,
    søknadsfrist,
} from '../routes/Saksbilde/Vilkår/Vilkårsgrupper/Vilkårsgrupper';

export interface VurderteVilkår {
    oppfylteVilkår: Vilkårdata[];
    ikkeOppfylteVilkår: Vilkårdata[];
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
}

const mapVilkår = (vilkår: Vilkår): VurdertVilkår[] => [
    {
        vilkår: Vilkårstype.Alder,
        oppfylt: vilkår.alder.oppfylt!,
    },
    {
        vilkår: Vilkårstype.Søknadsfrist,
        oppfylt: vilkår.søknadsfrist?.oppfylt!,
    },
    {
        vilkår: Vilkårstype.Opptjeningstid,
        oppfylt: vilkår.opptjening?.oppfylt!,
    },
    {
        vilkår: Vilkårstype.KravTilSykepengegrunnlag,
        oppfylt: vilkår.sykepengegrunnlag.oppfylt!,
    },
    {
        vilkår: Vilkårstype.DagerIgjen,
        oppfylt: vilkår.dagerIgjen?.oppfylt!,
    },
];

const tilVilkårsgruppe = (vurdertVilkår: VurdertVilkår, vilkår: Vilkår): ReactNode => {
    switch (vurdertVilkår.vilkår) {
        case Vilkårstype.Alder:
            return alder(vilkår.alder);
        case Vilkårstype.Søknadsfrist:
            return vilkår.søknadsfrist !== undefined ? søknadsfrist(vilkår.søknadsfrist) : undefined;
        case Vilkårstype.Opptjeningstid:
            return vilkår.opptjening
                ? opptjeningstid(vilkår.opptjening as Opptjening, vilkår.dagerIgjen.førsteFraværsdag)
                : undefined;
        case Vilkårstype.KravTilSykepengegrunnlag:
            return kravTilSykepengegrunnlag(vilkår.sykepengegrunnlag!, vilkår.alder.alderSisteSykedag);
        case Vilkårstype.DagerIgjen:
            return vilkår.dagerIgjen !== undefined ? dagerIgjen(vilkår.dagerIgjen) : undefined;
    }
};

export const useVilkår = (): VurderteVilkår | undefined => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    if (!aktivVedtaksperiode?.vilkår) return undefined;
    const { vilkår } = aktivVedtaksperiode;

    const vurderteVilkår: Vilkårdata[] = mapVilkår(vilkår).map((vurdertVilkår) => ({
        type: vurdertVilkår.vilkår,
        komponent: tilVilkårsgruppe(vurdertVilkår, vilkår),
        oppfylt: vurdertVilkår.oppfylt,
    }));

    const oppfylteVilkår: Vilkårdata[] = vurderteVilkår.filter((it) => it.oppfylt);
    const ikkeOppfylteVilkår: Vilkårdata[] = vurderteVilkår.filter((it) => !it.oppfylt);
    const ikkeVurderteVilkår: IkkeVurdertVilkår[] = vurderteVilkår
        .filter((it) => it.oppfylt == undefined)
        .map((it) => {
            switch (it.type) {
                case Vilkårstype.Alder:
                    return { label: 'Under 70 år', paragraf: '§ 8-51' };
                case Vilkårstype.Søknadsfrist:
                    return { label: 'Søknadsfrist', paragraf: '§ 22-13' };
                case Vilkårstype.Opptjeningstid:
                    return { label: 'Opptjening', paragraf: '§ 8-2' };
                case Vilkårstype.KravTilSykepengegrunnlag:
                    return { label: 'Krav til minste sykepengegrunnlag', paragraf: '§ 8-3' };
                case Vilkårstype.DagerIgjen:
                    return { label: 'Dager igjen', paragraf: '§§ 8-11 og 8-12' };
            }
        });

    return {
        oppfylteVilkår,
        ikkeOppfylteVilkår,
        ikkeVurderteVilkår,
    };
};
