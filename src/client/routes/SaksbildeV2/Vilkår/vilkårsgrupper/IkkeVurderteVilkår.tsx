import React from 'react';
import styled from '@emotion/styled';
import { Vilkårstittel } from '../Vilkårstittel';
import { Infoikon } from '../../../../components/ikoner/Infoikon';
import { Normaltekst } from 'nav-frontend-typografi';
import { Advarselikon } from '../../../../components/ikoner/Advarselikon';
import { Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { FlexColumn } from '../../../../components/Flex';

const Yrkesskadetekst = styled(Normaltekst)`
    padding-left: 2rem;
`;

const IkkeVurderteVilkårTittel = styled(Vilkårstittel)`
    margin-top: 0;
`;

const VilkårTilVurderingTittel = styled(Vilkårstittel)`
    margin-left: 2rem;
    margin-bottom: 0;
`;

const YrkesskadeContainer = styled.div`
    margin-bottom: 2rem;
`;

interface VilkårSystemetIkkeVurdererProps {
    vilkår: Vilkårdata[];
}

const VilkårSystemetIkkeVurderer = ({ vilkår }: VilkårSystemetIkkeVurdererProps) => (
    <FlexColumn data-testid="ikke-vurderte-vilkår">
        <Vilkårstittel ikon={<Advarselikon />} størrelse="m">
            Vilkår til vurdering
        </Vilkårstittel>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <React.Fragment key={i}>
                <VilkårTilVurderingTittel type={type} paragraf={paragraf}>
                    {tittel}
                </VilkårTilVurderingTittel>
                <Vilkårgrid>{komponent}</Vilkårgrid>
            </React.Fragment>
        ))}
    </FlexColumn>
);

const Yrkeskadeinfo = () => (
    <YrkesskadeContainer data-testid="yrkesskade">
        <IkkeVurderteVilkårTittel størrelse="m" ikon={<Infoikon />} paragraf="§ 8-55">
            Systemet henter ikke inn yrkesskade
        </IkkeVurderteVilkårTittel>
        <Yrkesskadetekst>Systemet henter per i dag ikke inn informasjon om yrkesskade.</Yrkesskadetekst>
        <Yrkesskadetekst>Yrkesskade kan ha påvirkning på utfallet av enkelte vilkår.</Yrkesskadetekst>
        <Yrkesskadetekst>Vurdering av yrkesskade følger ordinære rutiner.</Yrkesskadetekst>
    </YrkesskadeContainer>
);

interface IkkeVurderteVilkårProps {
    vilkår?: Vilkårdata[];
}

export const IkkeVurderteVilkår = ({ vilkår }: IkkeVurderteVilkårProps) => (
    <Vilkårkolonne>
        {vilkår && vilkår.length > 0 && <VilkårSystemetIkkeVurderer vilkår={vilkår} />}
        <Yrkeskadeinfo />
    </Vilkårkolonne>
);
