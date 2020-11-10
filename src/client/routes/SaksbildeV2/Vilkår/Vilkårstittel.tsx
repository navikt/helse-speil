import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Vilkårstype } from '../../../mapping/vilkår';

const Header = styled.div`
    display: flex;
    align-items: center;
    margin: 0.75rem 0;
    flex-wrap: nowrap;

    > * {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
    }
`;

const Tittel = styled.h2<VilkårstittelProps>`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 20px;
    padding: 0;
    color: #3e3832;
    margin: 0 0.5rem 0 0;
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

interface IkonContainerProps {
    størrelse: 's' | 'm';
}

const IkonContainer = styled.div<IkonContainerProps>`
    display: flex;
    align-items: center;
    width: 2rem;

    ${(props: IkonContainerProps) => {
        if (props.størrelse === 's') {
            return '> svg { padding-left: 3px };';
        }
        return '';
    }}
`;

const Paragraf = styled.p`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 0;
    padding: 0;
    color: #78706a;
    white-space: nowrap;
`;

interface VilkårstittelProps {
    children: ReactNode | ReactNode[];
    størrelse?: 's' | 'm';
    ikon?: ReactNode;
    paragraf?: string;
    className?: string;
    paragrafIkon?: ReactNode;
    type?: Vilkårstype;
}

export const Vilkårstittel = ({
    children,
    ikon,
    paragraf,
    className,
    størrelse = 's',
    paragrafIkon,
    type,
}: VilkårstittelProps) => (
    <Header className={className}>
        {ikon && <IkonContainer størrelse={størrelse}>{ikon}</IkonContainer>}
        <Tittel data-testid={type} størrelse={størrelse}>
            {children}
        </Tittel>
        {paragrafIkon && paragrafIkon}
        <Paragraf>{paragraf}</Paragraf>
    </Header>
);
