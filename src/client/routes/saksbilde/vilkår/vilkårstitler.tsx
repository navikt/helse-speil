import styled from '@emotion/styled';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Kryssikon } from '../../../components/ikoner/Kryssikon';
import { Sjekkikon } from '../../../components/ikoner/Sjekkikon';
import { Utropstegnikon } from '../../../components/ikoner/Utropstegnikon';
import { Vilkårstype } from '../../../mapping/vilkår';

const Header = styled.div<{ marginBottom: string }>`
    display: flex;
    align-items: start;
    flex-wrap: nowrap;
    ${({ marginBottom }) => `margin-bottom: ${marginBottom}`}
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
    color: var(--navds-color-text-primary);
    font-size: 18px;
    margin-right: 0.5rem;
    white-space: nowrap;
    min-height: 1.5rem;
`;

export const Paragraf = styled(Undertekst)`
    display: flex;
    align-items: center;
    color: var(--navds-color-text-disabled);
    white-space: nowrap;
    min-height: 1.5rem;
`;

interface VilkårsgruppetittelProps {
    children: ReactNode | ReactNode[];
    type?: Vilkårstype;
    oppfylt?: boolean;
    paragraf?: ReactNode;
    className?: string;
}

export const Vilkårsgruppetittel = ({ children, oppfylt, paragraf, type, className }: VilkårsgruppetittelProps) => (
    <Header className={classNames('vilkårsgruppetittel', className)} marginBottom="0.5rem">
        <IkonContainer>
            {oppfylt === undefined ? <Utropstegnikon /> : oppfylt ? <Sjekkikon /> : <Kryssikon />}
        </IkonContainer>
        <TekstContainer>
            <Tittel tag="h3" data-testid={type}>
                {children}
            </Tittel>
            {paragraf && <Paragraf>{paragraf}</Paragraf>}
        </TekstContainer>
    </Header>
);

interface VilkårskategoriProps {
    children: ReactNode | ReactNode[];
    ikon: ReactNode;
}

export const Vilkårskategori = ({ children, ikon }: VilkårskategoriProps) => (
    <Header className="vilkårskategori" marginBottom="2rem">
        <IkonContainer>{ikon}</IkonContainer>
        <Normaltekst>{children}</Normaltekst>
    </Header>
);
