import React from 'react';

import { useId } from '@navikt/ds-react';

export const IconArbeidsdag = ({ width = 16, height = 16, alt = 'Arbeidsdagikon', fill = 'var(--a-text-default)' }) => {
    let titleId: string | undefined = useId();
    titleId = alt ? alt + titleId : undefined;
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            role="img"
            aria-labelledby={titleId}
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={titleId}>{alt}</title>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.3334 0V16H0.666748V7.33333H6.00008V0H15.3334ZM14.0001 1.33333H7.33341V7.33333H10.0001V14.6667H14.0001V1.33333ZM8.66675 8.66667H2.00008V14.6667H8.66675V8.66667ZM7.33341 10V11.3333H3.33341V10H7.33341ZM12.6667 2.66667V12H11.3334V2.66667H12.6667ZM10.0001 2.66667V6H8.66675V2.66667H10.0001Z"
                fill={fill}
            />
        </svg>
    );
};
