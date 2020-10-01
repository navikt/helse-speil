import React from 'react';
import styled from '@emotion/styled';
import Vilkårstittel from '../Vilkårstittel';
import Vilkårsgrupperad from './Vilkårsgrupperad';
import { Grid } from '../../../../components/Grid';
import { Infoikon } from '../../../../components/ikoner/Infoikon';
import { Normaltekst } from 'nav-frontend-typografi';
import { Advarselikon } from '../../../../components/ikoner/Advarselikon';
import { Strek, Vilkårgrid, Vilkårinnhold } from '../Vilkår.styles';
import { FlexColumn } from '../../../../components/Flex';

const Yrkesskadetekst = styled(Normaltekst)`
    padding-left: 2rem;
`;

const Innhold = styled(Grid)`
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
        <Vilkårgrid>
            <Vilkårsgrupperad label="Arbeidsuførhet">§ 8-4</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Medvirkning">§ 8-8</Vilkårsgrupperad>
            {ikkeVurderteVilkår.map((v) => (
                <Vilkårsgrupperad key={v.label} label={v.label}>
                    {v.paragraf}
                </Vilkårsgrupperad>
            ))}
        </Vilkårgrid>
    </>
);

const Yrkeskadeinfo = () => (
    <>
        <IkkeVurderteVilkårTittel størrelse="m" ikon={<Infoikon />} paragraf="§ 8-55">
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

const IkkeVurderteVilkår = ({ className, ikkeVurderteVilkår }: IkkeVurderteVilkårProps) => (
    <>
        <Vilkårinnhold>
            <Innhold gridTemplateColumns="37rem auto" className={className}>
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

export default IkkeVurderteVilkår;
