import React, { ReactElement } from 'react';

type BlankIconProps = React.SVGAttributes<SVGSVGElement>;

export const BlankIcon = ({ ...svgProps }: BlankIconProps): ReactElement => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            {...svgProps}
        >
            <circle cx="9" cy="9" r="8.25" fill="#707070" stroke="#707070" strokeWidth="0.5" />
            <circle cx="9" cy="9" r="7.75" fill="#707070" stroke="#707070" strokeWidth="0.5" />
        </svg>
    );
};
