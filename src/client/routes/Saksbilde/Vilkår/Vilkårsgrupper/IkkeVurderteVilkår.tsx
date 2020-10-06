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
import { Risikovurdering } from 'internal-types';
import { ArbeidsuførhetIkkeVurdert } from './Vilkårsgrupper';

const Yrkesskadetekst = styled(Normaltekst)`
    padding-left: 2rem;
`;

const Innhold = styled(Grid)`
    justify-content: start;
`;

const IkkeVurderteVilkårTittel = styled(Vilkårstittel)`
    margin-top: 0;
`;

const VilkårContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export interface IkkeVurdertVilkår {
    label: string;
    paragraf: string;
}

interface VilkårSystemetIkkeVurdererProps {
    ikkeVurderteVilkår: IkkeVurdertVilkår[];
    risikovurdering?: Risikovurdering;
}

const VilkårSystemetIkkeVurderer = ({ ikkeVurderteVilkår, risikovurdering }: VilkårSystemetIkkeVurdererProps) => {
    if (ikkeVurderteVilkår.length === 0 && ArbeidsuførhetIkkeVurdert(risikovurdering) === null) return null;
    return (
        <>
            <IkkeVurderteVilkårTittel størrelse="m" ikon={<Advarselikon />}>
                Vilkår til vurdering
            </IkkeVurderteVilkårTittel>
            <VilkårContainer>
                {ArbeidsuførhetIkkeVurdert(risikovurdering)}
                <Vilkårgrid>
                    {ikkeVurderteVilkår.map((v) => (
                        <Vilkårsgrupperad key={v.label} label={v.label} bold>
                            {v.paragraf}
                        </Vilkårsgrupperad>
                    ))}
                </Vilkårgrid>
            </VilkårContainer>
        </>
    );
};

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
    risikovurdering?: Risikovurdering;
}

const IkkeVurderteVilkår = ({ className, ikkeVurderteVilkår, risikovurdering }: IkkeVurderteVilkårProps) => (
    <>
        <Vilkårinnhold>
            <Innhold gridTemplateColumns="37rem auto" className={className}>
                <FlexColumn>
                    <VilkårSystemetIkkeVurderer
                        ikkeVurderteVilkår={ikkeVurderteVilkår}
                        risikovurdering={risikovurdering}
                    />
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
