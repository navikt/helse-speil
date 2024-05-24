import React from 'react';

import { useId } from '@navikt/ds-react';

export interface IkonProps extends React.SVGAttributes<SVGElement> {
    alt?: string;
}

export const Ikon = React.forwardRef<SVGSVGElement, IkonProps>(
    ({ children, width = 16, height = 16, viewBox = '0 0 24 24', alt, ...rest }: IkonProps, ref) => {
        let titleId: string | undefined = useId();
        titleId = alt ? alt + titleId : undefined;
        return (
            <svg
                role="img"
                pointerEvents="none"
                aria-labelledby={titleId}
                width={width}
                height={height}
                viewBox={viewBox}
                {...rest}
                ref={ref}
            >
                <title id={titleId}>{alt}</title>
                {children}
            </svg>
        );
    },
);
