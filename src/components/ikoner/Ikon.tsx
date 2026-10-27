import React, { ComponentPropsWithRef, ReactElement } from 'react';

import { useId } from '@navikt/ds-react';

export interface IkonProps extends ComponentPropsWithRef<'svg'> {
    title?: string;
}

export const Ikon = ({
    children,
    width = 16,
    height = 16,
    viewBox = '0 0 24 24',
    title,
    ...props
}: IkonProps): ReactElement => {
    const titleId = useId();
    return (
        <svg
            role="img"
            pointerEvents="none"
            focusable={false}
            aria-labelledby={title ? titleId : undefined}
            aria-hidden={title ? undefined : true}
            width={width}
            height={height}
            viewBox={viewBox}
            {...props}
        >
            {title && <title id={titleId}>{title}</title>}
            {children}
        </svg>
    );
};
