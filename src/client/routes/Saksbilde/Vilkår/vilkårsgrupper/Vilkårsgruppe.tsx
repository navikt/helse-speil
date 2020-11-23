import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Vilkårgrid } from '../Vilkår.styles';

const Container = styled.div`
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
        margin-bottom: 1rem;
    }
`;

interface Props {
    tittel: string;
    paragraf?: string;
    children?: ReactNode | ReactNode[];
    className?: string;
}

export const Vilkårsgruppe = ({ tittel, paragraf, children, className }: Props) => (
    <Container className={className}>
        <Vilkårsgruppetittel paragraf={paragraf}>{tittel}</Vilkårsgruppetittel>
        {children && <Vilkårgrid>{children}</Vilkårgrid>}
    </Container>
);
