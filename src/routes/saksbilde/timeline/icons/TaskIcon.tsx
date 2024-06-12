import React, { ReactElement } from 'react';

import { useId } from '@navikt/ds-react';

interface TaskIconProps extends React.SVGAttributes<SVGSVGElement> {
    alt?: string;
}

export const TaskIcon = ({ alt = 'Task-ikon', ...svgProps }: TaskIconProps): ReactElement => {
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
            <circle cx="9" cy="9" r="8.25" fill="white" stroke="#262626" strokeWidth="0.5" />
            <circle cx="9" cy="9" r="7.75" fill="#262626" stroke="#262626" strokeWidth="0.5" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.7519 7.16064L12.6321 7.28038L10.7188 5.36732L10.8385 5.24793C10.9981 5.08794 11.2105 5 11.4365 5C11.6624 5 11.8748 5.0876 12.0345 5.24793L12.7519 5.96498C13.0817 6.29476 13.0817 6.8312 12.7519 7.16064ZM12.1533 7.75961L12.3926 7.52051L10.4798 5.60637L10.2405 5.84547L12.1533 7.75961ZM5.04952 12.9505C5.00826 12.9089 4.99101 12.849 5.00453 12.7922L5.51797 10.6055C5.52136 10.591 5.52677 10.5771 5.53387 10.5639L7.43644 12.4668C7.42325 12.4736 7.40972 12.4793 7.39517 12.4827L5.20781 12.9955C5.14828 13.0093 5.08977 12.9907 5.04952 12.9505ZM11.916 7.99805L7.68111 12.2329L5.76779 10.3196L10.0027 6.08472L11.916 7.99805Z"
                fill="white"
            />
        </svg>
    );
};
