import { Vilkår } from '../../context/types';

export enum Vilkårstype {
    Alder,
    Søknadsfrist,
    Opptjeningstid,
    KravTilSykepengegrunnlag,
    DagerIgjen
}

export interface VurdertVilkår {
    oppfylt: boolean;
    vilkår: Vilkårstype;
}

export const mapVilkår = (vilkår: Vilkår): VurdertVilkår[] => [
    {
        vilkår: Vilkårstype.Alder,
        oppfylt: vilkår.alder.oppfylt
    },
    {
        vilkår: Vilkårstype.Søknadsfrist,
        oppfylt: vilkår.søknadsfrist?.oppfylt!
    },
    {
        vilkår: Vilkårstype.Opptjeningstid,
        oppfylt: vilkår.opptjening?.oppfylt!
    },
    {
        vilkår: Vilkårstype.KravTilSykepengegrunnlag,
        oppfylt: vilkår.sykepengegrunnlag.oppfylt!
    },
    {
        vilkår: Vilkårstype.DagerIgjen,
        oppfylt: vilkår.dagerIgjen?.oppfylt!
    }
];
