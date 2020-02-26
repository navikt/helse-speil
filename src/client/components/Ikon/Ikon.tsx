import React, { ReactNode } from 'react';

interface IkonProps {
    children: ReactNode | ReactNode[];
    height?: number;
    width?: number;
    viewBoxSize?: number;
}

const Ikon = ({ children, width = 16, height = 16, viewBoxSize = 24 }: IkonProps) => {
    return (
        <svg width={width} height={height} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
            {children}
        </svg>
    );
};

export default Ikon;
