import React from 'react';
import styled from '@emotion/styled';
import { IkonContainer, Paragraf, Tittel, Vilkårsgruppetittel, Vilkårskategori } from '../vilkårstitler';
import { Infoikon } from '../../../../components/ikoner/Infoikon';
import { Normaltekst } from 'nav-frontend-typografi';
import { Advarselikon } from '../../../../components/ikoner/Advarselikon';
import { Vilkårgrid, Vilkårkolonne } from '../Vilkår.styles';
import { Vilkårdata } from '../../../../mapping/vilkår';
import { Flex, FlexColumn } from '../../../../components/Flex';

const IkkeVurdertVilkårContainer = styled.div`
    margin-bottom: 2rem;
`;

interface VilkårSystemetIkkeVurdererProps {
    vilkår: Vilkårdata[];
}

const VilkårSystemetIkkeVurderer = ({ vilkår }: VilkårSystemetIkkeVurdererProps) => (
    <FlexColumn data-testid="ikke-vurderte-vilkår">
        <Vilkårskategori ikon={<Advarselikon />}>Vilkår til vurdering</Vilkårskategori>
        {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
            <IkkeVurdertVilkårContainer key={i}>
                <Vilkårsgruppetittel type={type} paragraf={paragraf}>
                    {tittel}
                </Vilkårsgruppetittel>
                {komponent && <Vilkårgrid>{komponent}</Vilkårgrid>}
            </IkkeVurdertVilkårContainer>
        ))}
    </FlexColumn>
);

const Yrkesskadetekst = styled(Normaltekst)`
    padding-left: 2.5rem;
`;

const YrkesskadeContainer = styled.div`
    margin: 2rem 0;
`;

const Yrkeskadeinfo = () => (
    <YrkesskadeContainer data-testid="yrkesskade">
        <Flex alignItems="center" style={{ marginBottom: '0.5rem' }}>
            <IkonContainer>
                <Infoikon />
            </IkonContainer>
            <Tittel>Systemet henter ikke inn yrkesskade</Tittel>
            <Paragraf>§ 8-55</Paragraf>
        </Flex>
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
