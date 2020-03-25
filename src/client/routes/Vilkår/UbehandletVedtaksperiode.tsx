import React, { ReactNode } from 'react';
import Vilkårsvisning from './Vilkårsvisning';
import Feilikon from '../../components/Ikon/Feilikon';
import IkkeVurderteVilkår from './Vilkårsgrupper/IkkeVurderteVilkår';
import GrøntSjekkikon from '../../components/Ikon/GrøntSjekkikon';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';

interface UbehandletVedtaksperiodeProps {
    ikkeOppfylteVilkår: ReactNode[];
    oppfylteVilkår: ReactNode[];
}

const UbehandletVedtaksperiode = ({ ikkeOppfylteVilkår, oppfylteVilkår }: UbehandletVedtaksperiodeProps) => (
    <>
        <Varsel type={Varseltype.Advarsel}>Enkelte vilkår må vurderes manuelt</Varsel>
        {ikkeOppfylteVilkår.length > 0 && (
            <Vilkårsvisning tittel="Ikke oppfylte vilkår" ikon={<Feilikon />} vilkår={ikkeOppfylteVilkår} />
        )}
        <IkkeVurderteVilkår />
        <Vilkårsvisning tittel="Vurderte vilkår" ikon={<GrøntSjekkikon />} vilkår={oppfylteVilkår} />
    </>
);

export default UbehandletVedtaksperiode;
