import React, { SVGProps } from 'react';

export interface IkonProps extends SVGProps<any> {
    height?: number;
    width?: number;
    viewBox?: string;
    className?: string;
    alt?: string;
}

export const Ikon: React.FC<IkonProps> = ({
    children,
    width = 16,
    height = 16,
    viewBox = '0 0 24 24',
    className,
    alt,
    ...rest
}: IkonProps) => (
    <svg
        pointerEvents="none"
        aria-labelledby="title"
        width={width}
        height={height}
        viewBox={viewBox}
        className={className}
        {...rest}
    >
        <title id="title">{alt}</title>
        {children}
    </svg>
);
