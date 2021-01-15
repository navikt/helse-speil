import React, { ReactNode } from 'react';

export interface IkonProps {
    color?: string;
    width?: number;
    height?: number;
    viewBox?: string;
    children?: ReactNode | ReactNode[];
}

export const Ikon = ({ children, width = 16, height = 16, viewBox = '0 0 24 24' }: IkonProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox}>
        {children}
    </svg>
);
