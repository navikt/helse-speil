import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Vilkårstype } from '../../../mapping/vilkår';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import classNames from 'classnames';

const Header = styled.div`
    display: flex;
    align-items: start;
    flex-wrap: nowrap;
`;

export const IkonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    width: 2.5rem;
    min-height: 1.5rem;
`;

const TekstContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export const Tittel = styled(Undertittel)`
    display: flex;
    align-items: center;
    color: #3e3832;
    font-size: 18px;
    margin-right: 0.5rem;
    white-space: nowrap;
    min-height: 1.5rem;
`;

export const Paragraf = styled(Undertekst)`
    display: flex;
    align-items: center;
    color: #78706a;
    white-space: nowrap;
    min-height: 1.5rem;
`;

interface VilkårsgruppetittelProps {
    children: ReactNode | ReactNode[];
    type?: Vilkårstype;
    oppfylt?: boolean;
    paragraf?: ReactNode;
    className?: string;
    ikon?: ReactNode;
}

export const Vilkårsgruppetittel = ({
    children,
    oppfylt,
    paragraf,
    type,
    className,
    ikon,
}: VilkårsgruppetittelProps) => (
    <Header className={classNames('vilkårsgruppetittel', className)} style={{ marginBottom: '0.5rem' }}>
        <IkonContainer>{ikon}</IkonContainer>
        <TekstContainer>
            <Tittel tag="h3" data-testid={type}>
                {children}
            </Tittel>
            <Paragraf>{paragraf}</Paragraf>
        </TekstContainer>
    </Header>
);

interface VilkårskategoriProps {
    children: ReactNode | ReactNode[];
    ikon: ReactNode;
}

export const Vilkårskategori = ({ children, ikon }: VilkårskategoriProps) => (
    <Header className="vilkårskategori" style={{ marginBottom: '2rem' }}>
        <IkonContainer>{ikon}</IkonContainer>
        <Normaltekst>{children}</Normaltekst>
    </Header>
);
