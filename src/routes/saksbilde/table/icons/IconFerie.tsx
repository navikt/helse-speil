import React, { ReactElement } from 'react';

import { useId } from '@navikt/ds-react';

export const IconFerie = ({
    width = 16,
    height = 16,
    alt = 'Ferieikon',
    fill = 'var(--a-text-default)',
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
                d="M7.26486 1.31046L6.89116 0L5.60409 0.37167L5.97737 1.68222C2.06422 3.00524 -0.535076 5.71623 0.0937085 7.92456L0.555142 9.54514L3.77282 8.61597L4.23183 7.78205L5.05989 8.2443L7.63393 7.50059L9.10491 13.3333H10.4976L8.921 7.12892L11.4952 6.38595L11.9543 5.55203L12.7823 6.01428L16 5.0851L15.5386 3.46452C14.9098 1.25632 11.2793 0.344395 7.26486 1.31046ZM7.78629 2.55815C11.1261 1.81109 13.8911 2.5475 14.2562 3.82966L14.3533 4.17267L12.946 4.57867L11.433 3.73402L10.5933 5.258L5.224 6.80867L3.71053 5.96404L2.87133 7.488L1.47067 7.89267L1.37607 7.55943L1.35547 7.47438C1.08972 6.15309 3.12627 4.05364 6.40442 2.94531L6.97667 2.75133L7.57682 2.60678L7.78629 2.55815Z"
                fill={fill}
            />
            <path
                d="M14.5013 16C14.3289 15.6507 14.0117 15.2867 13.503 14.9476C12.665 14.3889 11.4303 14 10 14C8.56967 14 7.33506 14.3889 6.49697 14.9476C5.98833 15.2867 5.67107 15.6507 5.49869 16H4.08297C4.55905 14.1082 7.02701 12.6667 10 12.6667C12.973 12.6667 15.441 14.1082 15.9171 16H14.5013Z"
                fill={fill}
            />
        </svg>
    );
};
