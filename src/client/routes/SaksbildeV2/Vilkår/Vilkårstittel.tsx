import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

type Størrelse = 's' | 'm';

interface VilkårstittelProps {
    children: ReactNode | ReactNode[];
    størrelse?: Størrelse;
    ikon?: ReactNode;
    paragraf?: string;
    className?: string;
}

interface IkonContainerProps {
    størrelse: Størrelse;
}

const Header = styled.div`
    display: flex;
    align-items: center;
    margin: 0.75rem 0;
    flex-wrap: wrap;

    > * {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
    }
`;

const Tittel = styled.h2<VilkårstittelProps>`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-weight: 600;
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

export const Vilkårstittel = ({ children, ikon, paragraf, className, størrelse = 's' }: VilkårstittelProps) => (
    <Header className={className}>
        {ikon && <IkonContainer størrelse={størrelse}>{ikon}</IkonContainer>}
        <Tittel størrelse={størrelse}>{children}</Tittel>
        <Paragraf>{paragraf}</Paragraf>
    </Header>
);
