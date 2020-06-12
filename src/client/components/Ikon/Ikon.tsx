import React, { ReactNode } from 'react';

interface IkonProps {
    children: ReactNode | ReactNode[];
    height?: number;
    width?: number;
    viewBoxSize?: number;
    className?: string;
}

const Ikon = ({ children, width = 16, height = 16, viewBoxSize = 24, className }: IkonProps) => {
    return (
        <svg width={width} height={height} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className={className}>
            {children}
        </svg>
    );
};

export default Ikon;
