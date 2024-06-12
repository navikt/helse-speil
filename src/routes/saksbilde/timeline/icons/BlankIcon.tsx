import React, { ReactElement } from 'react';

import { useId } from '@navikt/ds-react';

interface BlankIconProps extends React.SVGAttributes<SVGSVGElement> {
    alt?: string;
}

export const BlankIcon = ({ alt = 'Blank-ikon', ...svgProps }: BlankIconProps): ReactElement => {
    let titleId: string | undefined = useId();
    titleId = alt ? alt + titleId : undefined;
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            role="img"
            aria-labelledby={titleId}
            xmlns="http://www.w3.org/2000/svg"
            {...svgProps}
        >
            <title id={titleId}>{alt}</title>
            <circle cx="9" cy="9" r="8.25" fill="#707070" stroke="#707070" strokeWidth="0.5" />
            <circle cx="9" cy="9" r="7.75" fill="#707070" stroke="#707070" strokeWidth="0.5" />
        </svg>
    );
};
