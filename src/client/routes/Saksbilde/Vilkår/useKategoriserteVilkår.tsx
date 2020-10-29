import React, { ReactNode } from 'react';
import { Vilkårdata } from './Vilkår';
import { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';
import { Opptjening, Vedtaksperiode, Vilkår } from 'internal-types';
import {
    alder,
    dagerIgjen,
    medlemskap,
    opptjeningstid,
    sykepengegrunnlag,
    søknadsfrist,
} from './Vilkårsgrupper/Vilkårsgrupper';
import { Vilkårstype } from '../../../mapping/vilkår';
import { Vilkårsgruppe } from './Vilkårsgrupper/Vilkårsgruppe';

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
        case Vilkårstype.Sykepengegrunnlag:
            return { label: 'Krav til minste sykepengegrunnlag', paragraf: '§ 8-3' };
        case Vilkårstype.DagerIgjen:
            return { label: 'Dager igjen', paragraf: '§§ 8-11 og 8-12' };
        case Vilkårstype.Medlemskap:
            return { label: 'Medlemskap', paragraf: '§ 2' };
        default:
            return { label: '', paragraf: '' };
    }
};

const ikkeVurderteVilkår = (vilkår: Vilkårdata[]) =>
    vilkår.filter(({ oppfylt }) => oppfylt === undefined).map(tilIkkeVurdertVilkår);

const oppfylteVilkår = (vilkår: Vilkårdata[]) => vilkår.filter(({ oppfylt }) => oppfylt);

const ikkeOppfylteVilkår = (vilkår: Vilkårdata[]) => vilkår.filter(({ oppfylt }) => oppfylt !== undefined && !oppfylt);

const vilkårdata = (type: Vilkårstype, vilkår: Vilkår, renderer: (vilkår: Vilkår) => ReactNode): Vilkårdata => ({
    type: type,
    oppfylt: vilkår[type as keyof Vilkår]?.oppfylt,
    komponent: renderer(vilkår),
});

export const useKategoriserteVilkår = ({ vilkår }: Vedtaksperiode): KategoriserteVilkår | undefined => {
    if (!vilkår) return undefined;

    const alleVilkår: Vilkårdata[] = [
        vilkårdata(Vilkårstype.Alder, vilkår, alder),
        vilkårdata(Vilkårstype.Søknadsfrist, vilkår, søknadsfrist),
        vilkårdata(Vilkårstype.Opptjeningstid, vilkår, opptjeningstid),
        vilkårdata(Vilkårstype.Sykepengegrunnlag, vilkår, sykepengegrunnlag),
        vilkårdata(Vilkårstype.DagerIgjen, vilkår, dagerIgjen),
        vilkårdata(Vilkårstype.Medlemskap, vilkår, medlemskap),
        {
            type: Vilkårstype.Institusjonsopphold,
            oppfylt: true,
            komponent: <Vilkårsgruppe tittel="Ingen institusjonsopphold" paragraf="§ 8-53 og 8-54" ikontype="ok" />,
        },
    ];

    return {
        oppfylteVilkår: oppfylteVilkår(alleVilkår),
        ikkeOppfylteVilkår: ikkeOppfylteVilkår(alleVilkår),
        ikkeVurderteVilkår: ikkeVurderteVilkår(alleVilkår),
    };
};
