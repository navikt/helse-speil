import React, { ReactNode } from 'react';
import Vilkårsvisning from './Vilkårsvisning';
import Feilikon from '../../components/Ikon/Feilikon';
import IkkeVurderteVilkår, { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';

interface UbehandletVedtaksperiodeProps {
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
}

export const Førstegangsbehandling = ({
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
