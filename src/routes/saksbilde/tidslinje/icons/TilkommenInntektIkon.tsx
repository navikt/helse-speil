import React, { ReactElement } from 'react';

export const TilkommenInntektIkon = ({ ...svgProps }: React.SVGAttributes<SVGSVGElement>): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="none"
        viewBox="0 0 24 24"
        focusable="false"
        role="img"
        {...svgProps}
    >
        <circle cx="12" cy="12" r="8" fill="white" />
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12M12 6.75a.75.75 0 0 1 .75.75v3.75h3.75a.75.75 0 0 1 0 1.5h-3.75v3.75a.75.75 0 0 1-1.5 0v-3.75H7.5a.75.75 0 0 1 0-1.5h3.75V7.5a.75.75 0 0 1 .75-.75"
            clipRule="evenodd"
        ></path>
    </svg>
);
