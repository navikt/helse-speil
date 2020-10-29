import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from '@emotion/styled';
import { Paragraf } from '../Vilkårstittel';

interface Props {
    children?: string[];
}

const Vurderinger = styled.ul`
    list-style: inside;
    color: #3e3832;
    margin-top: 0.5rem;
`;

const VurderingElement = styled(Normaltekst)`
    display: inline;
`;

const Navn = styled(Normaltekst)`
    min-width: 15rem;
    font-weight: 600;
`;

const RisikovurderingVilkårsgruppe = ({ children }: Props) => (
    <StyledRisikovurderingVilkårsgruppe>
        <Navn>Arbeidsuførhet, aktivitetsplikt og/eller medvirkning</Navn>
        <Paragraf>§ 8-4 FØRSTE LEDD, § 8-4 ANDRE LEDD og § 8-8</Paragraf>
        {children && (
            <Vurderinger>
                {children.map((vurdering) => (
                    <li>
                        <VurderingElement>{vurdering}</VurderingElement>
                    </li>
                ))}
            </Vurderinger>
        )}
    </StyledRisikovurderingVilkårsgruppe>
);

const StyledRisikovurderingVilkårsgruppe = styled.div`
    margin: 0 0 0.75rem 2rem;
`;

export default RisikovurderingVilkårsgruppe;
