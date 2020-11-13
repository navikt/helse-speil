import React, { ReactNode } from 'react';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import { Advarselikon } from '../../../../components/ikoner/Advarselikon';
import styled from '@emotion/styled';
import { Infoikon } from '../../../../components/ikoner/Infoikon';
import { Vilkårsgruppetittel } from '../vilkårstitler';
import { Kryssikon } from '../../../../components/ikoner/Kryssikon';
import { Vilkårgrid } from '../Vilkår.styles';

type Ikontype = 'ok' | 'advarsel' | 'info' | 'kryss';

const ikon = (type?: Ikontype) => {
    switch (type) {
        case 'ok':
            return <Sjekkikon />;
        case 'advarsel':
            return <Advarselikon />;
        case 'info':
            return <Infoikon />;
        case 'kryss':
            return <Kryssikon />;
        default:
            return undefined;
    }
};

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
    ikontype?: Ikontype;
    children?: ReactNode | ReactNode[];
    className?: string;
}

export const Vilkårsgruppe = ({ tittel, paragraf, ikontype, children, className }: Props) => (
    <Container className={className}>
        <Vilkårsgruppetittel paragraf={paragraf} ikon={ikon(ikontype)}>
            {tittel}
        </Vilkårsgruppetittel>
        {children && <Vilkårgrid>{children}</Vilkårgrid>}
    </Container>
);
