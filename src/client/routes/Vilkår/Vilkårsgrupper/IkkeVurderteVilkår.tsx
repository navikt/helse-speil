import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { FlexColumn } from '../../../components/FlexColumn';
import { Normaltekst } from 'nav-frontend-typografi';
import Advarselikon from '../../../components/Ikon/Advarselikon';
import Vilkårsgrupperad from './Vilkårsgrupperad';
import TwoColumnGrid from '../../../components/TwoColumnGrid';
import Infoikon from '../../../components/Ikon/Infoikon';
import Vilkårstittel from '../Vilkårstittel';

const Yrkesskadetekst = styled(Normaltekst)`
    padding-left: 2rem;
`;

const Innhold = styled(TwoColumnGrid)`
    padding: 1rem 1.5rem;
    justify-content: start;
    border-bottom: 1px solid #b7b1a9;
`;

const Grid = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
    margin: 0 0 1.5rem 2rem;
`;

const Container = styled.div`
    margin: 0.5rem;
`;

const VilkårSystemetIkkeVurderer = () => (
    <Container>
        <Vilkårstittel størrelse="m" ikon={<Advarselikon />}>
            Vilkår systemet ikke vurderer
        </Vilkårstittel>
        <Grid>
            <Vilkårsgrupperad label="Arbeidsuførhet">§8-4</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Medlemskap">§2</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Medvirkning">§8-8</Vilkårsgrupperad>
        </Grid>
    </Container>
);

const Yrkeskadeinfo = () => (
    <Container>
        <Vilkårstittel størrelse="m" ikon={<Infoikon />} paragraf="8-55">
            Systemet henter ikke inn yrkesskade
        </Vilkårstittel>
        <Yrkesskadetekst>Systemet henter per i dag ikke inn informasjon om yrkesskade.</Yrkesskadetekst>
        <Yrkesskadetekst>Yrkesskade kan ha påvirkning på utfallet av enkelte vilkår.</Yrkesskadetekst>
        <Yrkesskadetekst>Vurdering av yrkesskade følger ordinære rutiner.</Yrkesskadetekst>
    </Container>
);

const IkkeVurderteVilkår = ({ className }: { className?: string }) => {
    return (
        <Innhold className={className}>
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
