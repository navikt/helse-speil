import React, { ReactNode } from 'react';
// @ts-ignore
import Icon from 'nav-frontend-ikoner-assets';
import IkonSjekk from '../Ikon/IkonSjekk';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import styled from '@emotion/styled';

type Ikontype = 'ok' | 'advarsel';

interface Props {
    tittel: string;
    paragraf?: string;
    ikontype?: Ikontype;
    className?: string;
    children?: ReactNode | ReactNode[];
}

const OkIkon = styled(IkonSjekk)`
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

const Tittel = styled(Undertittel)`
    font-size: 18px;
    color: #3e3832;
    margin-right: 0.5rem;
`;

const Paragraf = styled(Undertekst)`
    color: #78706a;
`;

const Header = styled.span`
    display: flex;
    align-items: center;
    grid-area: tittel;
`;

const Container = styled.div`
    display: grid;
    grid-column-gap: 0.5rem;
    grid-row-gap: 1rem;
    grid-template-columns: 2rem max-content auto;
    grid-template-areas: 'ikon tittel tittel' '. body body';
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    &:not(:last-child) {
        border-bottom: 1px solid #e7e9e9;
    }
`;

const Body = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
`;

const Vilkårsgruppe = ({ tittel, paragraf, ikontype, className, children }: Props) => {
    return (
        <Container>
            {ikontype && ikon(ikontype)}
            <Header>
                <Tittel>{tittel}</Tittel>
                <Paragraf>{paragraf}</Paragraf>
            </Header>
            <Body>{children}</Body>
        </Container>
    );
};

export default Vilkårsgruppe;
