import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Vilkårstype } from '../../../mapping/vilkår';
import classNames from 'classnames';

const Header = styled.div`
    display: flex;
    align-items: start;
    margin: 0.75rem 0;
    flex-wrap: nowrap;

    > * {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
    }
`;

const IkonContainer = styled.div<{ størrelse: 's' | 'm' }>`
    display: flex;
    align-items: center;
    min-width: 2rem;
    width: 2rem;
    margin: 7px 0;

    ${({ størrelse }) => (størrelse === 's' ? '> svg { padding-left: 3px };' : '')}
`;

const TekstContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Tittel = styled.h2<VilkårstittelProps>`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 20px;
    padding: 0;
    color: #3e3832;
    margin: 2px 8px 2px 0;
    white-space: nowrap;

    ${(props: VilkårstittelProps) => {
        switch (props.størrelse) {
            case 'm':
                return 'font-size: 20px;';
            case 's':
            default:
                return 'font-size: 18px;> svg { padding-left: 7px };';
        }
    }}
`;

const Paragraf = styled.p`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 4px 0;
    padding: 0;
    color: #78706a;
    white-space: nowrap;
`;

interface VilkårstittelProps {
    children: ReactNode | ReactNode[];
    størrelse?: 's' | 'm';
    ikon?: ReactNode;
    paragraf?: ReactNode;
    className?: string;
    type?: Vilkårstype;
}

export const Vilkårstittel = ({ children, ikon, paragraf, className, størrelse = 's', type }: VilkårstittelProps) => (
    <Header className={classNames('vilkårstittel', className)}>
        {ikon && <IkonContainer størrelse={størrelse}>{ikon}</IkonContainer>}
        <TekstContainer>
            <Tittel data-testid={type} størrelse={størrelse}>
                {children}
            </Tittel>
            <Paragraf>{paragraf}</Paragraf>
        </TekstContainer>
    </Header>
);

interface VilkårsgruppetittelProps {
    children: ReactNode | ReactNode[];
}

export const Vilkårsgruppetittel = ({ children }: VilkårsgruppetittelProps) => null;
