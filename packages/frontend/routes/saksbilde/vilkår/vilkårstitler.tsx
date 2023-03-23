import { IkonContainer } from './Vilkår.styles';
import styled from '@emotion/styled';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Kryssikon } from '@components/ikoner/Kryssikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Utropstegnikon } from '@components/ikoner/Utropstegnikon';

import { Vilkårstype } from '../../../mapping/vilkår';

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

export const Tittel = styled(BodyShort)`
    display: flex;
    align-items: center;
    color: var(--a-text-default);
    font-size: 18px;
    font-weight: 600;
    margin-right: 0.5rem;
    white-space: nowrap;
    min-height: 1.5rem;
`;

export const Paragraf = styled(BodyShort)`
    font-size: 14px;
    display: flex;
    align-items: center;
    color: var(--a-text-subtle);
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
            <Tittel as="h3" data-testid={type}>
                {children}
            </Tittel>
            {paragraf && <Paragraf as="p">{paragraf}</Paragraf>}
        </TekstContainer>
    </Header>
);
