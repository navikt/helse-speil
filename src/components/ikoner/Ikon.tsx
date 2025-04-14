import React, { ComponentPropsWithRef, ReactElement } from 'react';

import { useId } from '@navikt/ds-react';

export interface IkonProps extends ComponentPropsWithRef<'svg'> {
    alt?: string;
}

export const Ikon = ({
    children,
    width = 16,
    height = 16,
    viewBox = '0 0 24 24',
    alt,
    ...props
}: IkonProps): ReactElement => {
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
            {...props}
        >
            <title id={titleId}>{alt}</title>
            {children}
        </svg>
    );
};
