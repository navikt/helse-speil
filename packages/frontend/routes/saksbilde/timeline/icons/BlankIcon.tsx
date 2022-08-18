import React from 'react';

interface BlankIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const BlankIcon: React.FC<BlankIconProps> = ({ ...svgProps }) => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
            <circle cx="9" cy="9" r="8.25" fill="#707070" stroke="#707070" strokeWidth="0.5" />
            <circle cx="9" cy="9" r="7.75" fill="#707070" stroke="#707070" strokeWidth="0.5" />
        </svg>
    );
};
