import { ReactNode } from 'react';
import { Vilkårdata } from './Vilkår';
import { Vilkårstype } from '../../../context/mapping/vilkår';
import { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';
import { Opptjening, Vedtaksperiode, Vilkår } from 'internal-types';
import { alder, dagerIgjen, opptjeningstid, sykepengegrunnlag, søknadsfrist } from './Vilkårsgrupper/Vilkårsgrupper';

export interface KategoriserteVilkår {
    oppfylteVilkår: Vilkårdata[];
    ikkeOppfylteVilkår: Vilkårdata[];
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
}

const tilIkkeVurdertVilkår = ({ type }: Vilkårdata): IkkeVurdertVilkår => {
    switch (type) {
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
};

const ikkeVurderteVilkår = (vilkår: Vilkårdata[]) =>
    vilkår.filter(({ oppfylt }) => oppfylt === undefined).map(tilIkkeVurdertVilkår);

const oppfylteVilkår = (vilkår: Vilkårdata[]) => vilkår.filter(({ oppfylt }) => oppfylt);

const ikkeOppfylteVilkår = (vilkår: Vilkårdata[]) => vilkår.filter(({ oppfylt }) => !oppfylt);

const vilkårdata = (type: Vilkårstype, vilkår: Vilkår, renderer: (vilkår: Vilkår) => ReactNode): Vilkårdata => ({
    type,
    oppfylt: vilkår[type]?.oppfylt,
    komponent: renderer(vilkår),
});

export const useKategoriserteVilkår = ({ vilkår }: Vedtaksperiode): KategoriserteVilkår | undefined => {
    if (!vilkår) return undefined;

    const alleVilkår: Vilkårdata[] = [
        vilkårdata(Vilkårstype.Alder, vilkår, alder),
        vilkårdata(Vilkårstype.Søknadsfrist, vilkår, søknadsfrist),
        vilkårdata(Vilkårstype.Opptjeningstid, vilkår, opptjeningstid),
        vilkårdata(Vilkårstype.KravTilSykepengegrunnlag, vilkår, sykepengegrunnlag),
        vilkårdata(Vilkårstype.DagerIgjen, vilkår, dagerIgjen),
    ];

    return {
        oppfylteVilkår: oppfylteVilkår(alleVilkår),
        ikkeOppfylteVilkår: ikkeOppfylteVilkår(alleVilkår),
        ikkeVurderteVilkår: ikkeVurderteVilkår(alleVilkår),
    };
};
