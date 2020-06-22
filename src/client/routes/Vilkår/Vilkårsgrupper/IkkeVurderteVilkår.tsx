import React from 'react';
import styled from '@emotion/styled';
import { FlexColumn } from '../../../components/FlexColumn';
import { Normaltekst } from 'nav-frontend-typografi';
import Advarselikon from '../../../components/Ikon/Advarselikon';
import Vilkårsgrupperad from './Vilkårsgrupperad';
import TwoColumnGrid from '../../../components/TwoColumnGrid';
import Infoikon from '../../../components/Ikon/Infoikon';
import Vilkårstittel from '../Vilkårstittel';
import { Strek, Grid, Vilkårinnhold } from '../Vilkår.styles';

const Yrkesskadetekst = styled(Normaltekst)`
    padding-left: 2rem;
`;

const Innhold = styled(TwoColumnGrid)`
    justify-content: start;
`;

const IkkeVurderteVilkårTittel = styled(Vilkårstittel)`
    margin-top: 0;
`;

export interface IkkeVurdertVilkår {
    label: string;
    paragraf: string;
}

interface VilkårSystemetIkkeVurdererProps {
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
}

const VilkårSystemetIkkeVurderer = ({ ikkeVurderteVilkår }: VilkårSystemetIkkeVurdererProps) => (
    <>
        <IkkeVurderteVilkårTittel størrelse="m" ikon={<Advarselikon />}>
            Vilkår systemet ikke vurderer
        </IkkeVurderteVilkårTittel>
        <Grid>
            <Vilkårsgrupperad label="Arbeidsuførhet">§8-4</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Medlemskap">§2</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Medvirkning">§8-8</Vilkårsgrupperad>
            {ikkeVurderteVilkår.map((v) => (
                <Vilkårsgrupperad label={v.label}>{v.paragraf}</Vilkårsgrupperad>
            ))}
        </Grid>
    </>
);

const Yrkeskadeinfo = () => (
    <>
        <IkkeVurderteVilkårTittel størrelse="m" ikon={<Infoikon />} paragraf="8-55">
            Systemet henter ikke inn yrkesskade
        </IkkeVurderteVilkårTittel>
        <Yrkesskadetekst>Systemet henter per i dag ikke inn informasjon om yrkesskade.</Yrkesskadetekst>
        <Yrkesskadetekst>Yrkesskade kan ha påvirkning på utfallet av enkelte vilkår.</Yrkesskadetekst>
        <Yrkesskadetekst>Vurdering av yrkesskade følger ordinære rutiner.</Yrkesskadetekst>
    </>
);

interface IkkeVurderteVilkårProps {
    className?: string;
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
}

const IkkeVurderteVilkår = ({ className, ikkeVurderteVilkår }: IkkeVurderteVilkårProps) => {
    return (
        <>
            <Vilkårinnhold>
                <Innhold className={className}>
                    <FlexColumn>
                        <VilkårSystemetIkkeVurderer ikkeVurderteVilkår={ikkeVurderteVilkår} />
                    </FlexColumn>
                    <FlexColumn>
                        <Yrkeskadeinfo />
                    </FlexColumn>
                </Innhold>
            </Vilkårinnhold>
            <Strek />
        </>
    );
};

export default IkkeVurderteVilkår;
