import React from 'react';

interface CheckIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const CheckIcon: React.FC<CheckIconProps> = ({ ...svgProps }) => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
            <circle cx="9" cy="9" r="8.25" fill="white" stroke="#262626" strokeWidth="0.5" />
            <circle cx="9" cy="9" r="7.75" fill="#262626" stroke="#262626" strokeWidth="0.5" />
            <path
                d="M7.53174 10.5656L12.3718 6.19067C12.6656 5.92446 13.1277 5.93845 13.4031 6.22358C13.6787 6.50885 13.6629 6.95643 13.3685 7.22326L8.01173 12.0656C7.87536 12.1881 7.69753 12.2545 7.51494 12.2545C7.32315 12.2545 7.13877 12.1821 6.99873 12.0479L5.21355 10.3189C4.92882 10.0431 4.92882 9.59537 5.21355 9.31959C5.49829 9.04381 5.96054 9.04381 6.24528 9.31959L7.53174 10.5656Z"
                fill="white"
            />
        </svg>
    );
};
