import React from 'react';

export interface IkonProps extends React.SVGAttributes<SVGElement> {
    alt?: string;
}

export const Ikon = React.forwardRef<SVGSVGElement, IkonProps>(
    ({ children, width = 16, height = 16, viewBox = '0 0 24 24', alt, ...rest }: IkonProps, ref) => (
        <svg
            pointerEvents="none"
            aria-labelledby="title"
            width={width}
            height={height}
            viewBox={viewBox}
            {...rest}
            ref={ref}
        >
            <title id="title">{alt}</title>
            {children}
        </svg>
    ),
);
