import React, { ReactNode } from 'react';
import Sjekkikon from '../../../components/Ikon/Sjekkikon';
import Advarselikon from '../../../components/Ikon/Advarselikon';
import styled from '@emotion/styled';
import Infoikon from '../../../components/Ikon/Infoikon';
import Vilkårstittel from '../Vilkårstittel';

type Ikontype = 'ok' | 'advarsel' | 'info';

interface Props {
    tittel: string;
    paragraf?: string;
    ikontype?: Ikontype;
    children?: ReactNode | ReactNode[];
}

const ikon = (type?: Ikontype) => {
    switch (type) {
        case 'ok':
            return <Sjekkikon />;
        case 'advarsel':
            return <Advarselikon />;
        case 'info':
            return <Infoikon />;
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

const Grid = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
    margin: 0 0 1.5rem 2rem;
`;

const Vilkårsgruppe = ({ tittel, paragraf, ikontype, children }: Props) => {
    return (
        <Container>
            <Vilkårstittel paragraf={paragraf} ikon={ikon(ikontype)}>
                {tittel}
            </Vilkårstittel>
            {children && <Grid>{children}</Grid>}
        </Container>
    );
};

export default Vilkårsgruppe;
