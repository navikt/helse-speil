import React, { ReactElement } from 'react';

export const FjernetTilkommenInntektIkon = ({ ...svgProps }: React.SVGAttributes<SVGSVGElement>): ReactElement => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
    >
        <circle cx="9" cy="9" r="8.25" fill="white" stroke="black" strokeWidth="1" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6673 12C11.582 12 11.4966 11.9673 11.4313 11.9027L6.09751 6.56888C5.9675 6.43887 5.9675 6.22752 6.09751 6.09751C6.22752 5.9675 6.43887 5.9675 6.56888 6.09751L11.9027 11.4313C12.0327 11.5613 12.0327 11.7726 11.9027 11.9027C11.838 11.9673 11.7526 12 11.6673 12Z"
            stroke="black"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.33353 12C6.24819 12 6.16285 11.9673 6.09751 11.9027C5.9675 11.7726 5.9675 11.5613 6.09751 11.4313L11.4313 6.09751C11.5613 5.9675 11.7726 5.9675 11.9027 6.09751C12.0327 6.22752 12.0327 6.43887 11.9027 6.56888L6.56888 11.9027C6.50421 11.9673 6.41887 12 6.33353 12Z"
            stroke="black"
        />
    </svg>
);
