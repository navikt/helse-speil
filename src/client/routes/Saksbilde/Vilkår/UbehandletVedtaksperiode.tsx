import React, { ReactNode } from 'react';
import { Vilkårsvisning } from './Vilkårsvisning';
import IkkeVurderteVilkår, { IkkeVurdertVilkår } from './Vilkårsgrupper/IkkeVurderteVilkår';
import { GrøntSjekkikon } from '../../../components/ikoner/GrøntSjekkikon';
import { Feilikon } from '../../../components/ikoner/Feilikon';
import { Risikovurdering } from 'internal-types';

interface UbehandletVedtaksperiodeProps {
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
    risikovurdering?: Risikovurdering;
}

export const Førstegangsbehandling = ({
    ikkeOppfylteVilkår,
    oppfylteVilkår,
    ikkeVurderteVilkår,
    risikovurdering,
}: UbehandletVedtaksperiodeProps) => (
    <>
        {ikkeOppfylteVilkår.length > 0 && (
            <Vilkårsvisning tittel="Ikke oppfylte vilkår" ikon={<Feilikon />} vilkår={ikkeOppfylteVilkår} />
        )}
        <IkkeVurderteVilkår ikkeVurderteVilkår={ikkeVurderteVilkår} risikovurdering={risikovurdering} />
        <Vilkårsvisning
            tittel="Vurderte vilkår"
            ikon={<GrøntSjekkikon />}
            vilkår={oppfylteVilkår}
            risikovurdering={risikovurdering}
        />
    </>
);
