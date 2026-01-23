import React, { ReactElement } from 'react';

import { useId } from '@navikt/ds-react';

export const IconEgenmelding = ({
    width = 16,
    height = 16,
    alt = 'Egenmeldingikon',
    fill = 'var(--ax-text-neutral)',
}): ReactElement => {
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
                d="M2 1.33333C2 0.596954 2.59695 0 3.33333 0H12.6667C13.403 0 14 0.596954 14 1.33333V14.6667C14 15.403 13.403 16 12.6667 16H3.33333C2.59695 16 2 15.403 2 14.6667V1.33333ZM3.33333 14.6667V1.33333H12.6667V14.6667H3.33333Z"
                fill={fill}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.3333 4.66667H4.66667V3.33333H11.3333V4.66667Z"
                fill={fill}
            />
            <path fillRule="evenodd" clipRule="evenodd" d="M11.3333 7.33333H4.66667V6H11.3333V7.33333Z" fill={fill} />
            <path fillRule="evenodd" clipRule="evenodd" d="M8 10H4.66667V8.66667H8V10Z" fill={fill} />
        </svg>
    );
};
