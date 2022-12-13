import React from 'react';

interface CheckIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const CheckIcon: React.FC<CheckIconProps> = ({ ...svgProps }) => {
    return (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
            <circle cx="8" cy="8" r="7.5" fill="#007C2E" stroke="#007C2E" />
            <path
                d="M6.53174 9.56559L11.3718 5.19067C11.6656 4.92446 12.1277 4.93845 12.4031 5.22358C12.6787 5.50885 12.6629 5.95643 12.3685 6.22326L7.01173 11.0656C6.87536 11.1881 6.69753 11.2545 6.51494 11.2545C6.32315 11.2545 6.13877 11.1821 5.99873 11.0479L4.21355 9.31886C3.92882 9.04308 3.92882 8.59537 4.21355 8.31959C4.49829 8.04381 4.96054 8.04381 5.24528 8.31959L6.53174 9.56559Z"
                fill="white"
            />
        </svg>
    );
};
