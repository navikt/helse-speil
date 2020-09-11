import React, { SVGProps } from 'react';

export interface IkonProps extends SVGProps<any> {
    height?: number;
    width?: number;
    viewBoxSize?: number;
    className?: string;
}

export const Ikon: React.FC<IkonProps> = ({
    children,
    width = 16,
    height = 16,
    viewBoxSize = 24,
    className,
    ...rest
}: IkonProps) => (
    <svg width={width} height={height} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className={className} {...rest}>
        {children}
    </svg>
);
