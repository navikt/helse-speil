import React from 'react';
// @ts-ignore
import styled from '@emotion/styled';
import { FlexColumn } from '../../components/FlexColumn';
import { Normaltekst } from 'nav-frontend-typografi';
import { Container } from './Vilkårsgruppe/Vilkårsgruppe';
import Advarselikon from '../../components/Ikon/Advarselikon';
import Vilkårsgrupperad from './Vilkårsgruppe/Vilkårsgrupperad';
import { Deloverskrift, Ikon } from './components';
import TwoColumnGrid from '../../components/TwoColumnGrid';

const Yrkesskadetekst = styled.span`
    padding-left: 2.5rem;
`;

export const Innhold = styled(TwoColumnGrid)`
    padding: 1rem 1.5rem;
    justify-content: start;
`;

const IkkeVurderingGrid = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
    margin: 0 0 1.5rem 2.5rem;
`;

const VilkårSystemetIkkeVurderer = () => (
    <Container>
        <Deloverskrift tittel="Vilkår systemet ikke vurderer" ikon={<Advarselikon height={25} width={25} />} />
        <IkkeVurderingGrid>
            <Vilkårsgrupperad label="Arbeidsuførhet">§8-4</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Medlemskap">§2</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Medvirkning">§8-8</Vilkårsgrupperad>
        </IkkeVurderingGrid>
    </Container>
);

const Yrkeskadeinfo = () => (
    <Container>
        <Deloverskrift
            tittel="Systemet henter ikke inn yrkesskade"
            ikon={<Ikon kind={`info-sirkel-fyll`} size={24} />}
            paragraf="8-55"
        />
        <Yrkesskadetekst>
            <Normaltekst>
                Systemet henter per i dag ikke inn informasjon om yrkesskade.
                <br />
                Yrkesskade kan ha påvirkning på utfallet av enkelte vilkår.
                <br />
                Vurdering av yrkesskade følger ordinære rutiner.
            </Normaltekst>
        </Yrkesskadetekst>
    </Container>
);

const IkkeVurderteVilkår = () => {
    return (
        <Innhold>
            <FlexColumn>
                <VilkårSystemetIkkeVurderer />
            </FlexColumn>
            <FlexColumn>
                <Yrkeskadeinfo />
            </FlexColumn>
        </Innhold>
    );
};

export default IkkeVurderteVilkår;
