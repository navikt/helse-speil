import React, { ReactNode } from 'react';
import Vilkårsvisning from './Vilkårsvisning';
import Feilikon from '../../components/Ikon/Feilikon';
import IkkeVurderteVilkår, { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';
import { VilkårVurdertIInfotrygd } from './PåfølgendeVedtaksperiode';

interface UbehandletVedtaksperiodeProps {
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
}

export const UbehandletVedtaksperiode = ({
    ikkeOppfylteVilkår,
    oppfylteVilkår,
    ikkeVurderteVilkår,
}: UbehandletVedtaksperiodeProps) => (
    <>
        {ikkeOppfylteVilkår.length > 0 && (
            <Vilkårsvisning tittel="Ikke oppfylte vilkår" ikon={<Feilikon />} vilkår={ikkeOppfylteVilkår} />
        )}
        <IkkeVurderteVilkår ikkeVurderteVilkår={ikkeVurderteVilkår} />
        <Vilkårsvisning tittel="Vurderte vilkår" ikon={<GrøntSjekkikon />} vilkår={oppfylteVilkår} />
    </>
);

export const UbehandletVedtaksperiodeFraInfotrygd = ({
    ikkeOppfylteVilkår,
    oppfylteVilkår,
    ikkeVurderteVilkår,
}: UbehandletVedtaksperiodeProps) => (
    <>
        {ikkeOppfylteVilkår.length > 0 && (
            <Vilkårsvisning tittel="Ikke oppfylte vilkår" ikon={<Feilikon />} vilkår={ikkeOppfylteVilkår} />
        )}
        <IkkeVurderteVilkår ikkeVurderteVilkår={ikkeVurderteVilkår} />
        <Vilkårsvisning tittel="Vurderte vilkår" ikon={<GrøntSjekkikon />} vilkår={oppfylteVilkår} />
        <VilkårVurdertIInfotrygd />
    </>
);
