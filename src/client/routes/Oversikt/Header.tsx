import React, { ReactNode } from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import { HeaderView } from './Oversikt.styles';

interface HeaderProps {
    children: ReactNode | ReactNode[];
    widthInPixels?: number;
}

export const Header = ({ children, widthInPixels }: HeaderProps) => (
    <HeaderView widthInPixels={widthInPixels}>
        <Undertekst>{children}</Undertekst>
    </HeaderView>
);
