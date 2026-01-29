import React, { ReactElement } from 'react';

import { useId } from '@navikt/ds-react';

interface UvurderteVarslerIconProps extends React.SVGAttributes<SVGSVGElement> {
    alt?: string;
}

export const UvurderteVarslerIcon = ({
    alt = 'Uvurderte-varsler-ikon',
    ...svgProps
}: UvurderteVarslerIconProps): ReactElement => {
    let titleId: string | undefined = useId();
    titleId = alt ? alt + titleId : undefined;
    return (
        <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            role="img"
            aria-labelledby={titleId}
            xmlns="http://www.w3.org/2000/svg"
            {...svgProps}
        >
            <title id={titleId}>{alt}</title>
            <path
                d="M6.49135 0.328848C6.70292 -0.104036 7.28641 -0.11103 7.50721 0.316672L13.9315 13.1013C14.1405 13.5063 13.8631 14 13.4266 14H0.575864C0.145067 14 -0.132785 13.518 0.0648783 13.1135L6.49135 0.328848Z"
                fill="var(--ax-bg-warning-strong)"
            />
        </svg>
    );
};
