import styled from '@emotion/styled';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Kryssikon } from '../../../components/ikoner/Kryssikon';
import { Sjekkikon } from '../../../components/ikoner/Sjekkikon';
import { Utropstegnikon } from '../../../components/ikoner/Utropstegnikon';
import { Vilkårstype } from '../../../mapping/vilkår';

import { IkonContainer } from './Vilkår.styles';

const Header = styled.div`
    display: flex;
    align-items: start;
    flex-wrap: nowrap;

    &:not(:last-of-type) {
        padding-bottom: 0.5rem;
    }
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
    <Header className={classNames('vilkårsgruppetittel', className)}>
        <IkonContainer>
            {oppfylt === undefined ? (
                <Utropstegnikon alt="Til vurdering" />
            ) : oppfylt ? (
                <Sjekkikon alt="Oppfylt" />
            ) : (
                <Kryssikon alt="Ikke oppfylt" />
            )}
        </IkonContainer>
        <TekstContainer>
            <Tittel tag="h3" data-testid={type}>
                {children}
            </Tittel>
            {paragraf && <Paragraf>{paragraf}</Paragraf>}
        </TekstContainer>
    </Header>
);
