import React, { ReactNode } from 'react';
// @ts-ignore
import Icon from 'nav-frontend-ikoner-assets';
import Sjekkikon from '../../../components/Ikon/Sjekkikon';
import styled from '@emotion/styled';

type Ikontype = 'ok' | 'advarsel';

interface Props {
    tittel: string;
    paragraf?: string;
    ikontype?: Ikontype;
    className?: string;
    children?: ReactNode | ReactNode[];
}

const marginLeft = '2.5rem';

const OkIkon = styled(Sjekkikon)`
    grid-area: ikon;
`;

const Ikon = styled(Icon)`
    grid-area: ikon;
`;

const ikon = (type: Ikontype) => {
    switch (type) {
        case 'ok':
            return <OkIkon />;
        case 'advarsel':
            return <Ikon kind={`advarsel-sirkel-fyll`} size={20} />;
    }
};

const Tittel = styled.h2`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 18px;
    padding: 0;
    color: #3e3832;
    margin: 0 0.5rem 0 0;
`;

const Paragraf = styled.p`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 0;
    padding: 0;
    color: #78706a;
`;

const Header = styled.span`
    display: flex;
    align-items: center;
    margin: 1rem 0;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
        border-bottom: 1px solid #e7e9e9;
        margin-bottom: 1rem;
    }
`;

const IkonContainer = styled.span`
    display: flex;
    align-items: center;
    width: ${marginLeft};
`;

const Grid = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
    margin: 0 0 1.5rem ${marginLeft};
`;

const Vilkårsgruppe = ({ tittel, paragraf, ikontype, className, children }: Props) => {
    return (
        <Container>
            <Header>
                <IkonContainer>{ikontype && ikon(ikontype)}</IkonContainer>
                <Tittel>{tittel}</Tittel>
                <Paragraf>{paragraf}</Paragraf>
            </Header>
            {children && <Grid>{children}</Grid>}
        </Container>
    );
};

export default Vilkårsgruppe;
