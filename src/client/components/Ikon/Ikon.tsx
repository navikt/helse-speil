import React, { ReactNode } from 'react';

interface IkonProps {
    children: ReactNode | ReactNode[];
    height?: number;
    width?: number;
}

const Ikon = ({ children, width = 16, height = 16 }: IkonProps) => {
    return (
        <svg width={16} height={16}>
            {children}
        </svg>
    );
};

export default Ikon;
