import React from 'react';

export const IconFailure = ({ width = 14, height = 14, fill = 'var(--navds-color-text-primary)' }) => (
    <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.7155 14L7.03769e-07 1.28446L1.28446 0L14 12.7155L12.7155 14Z"
            fill={fill}
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.28446 14L14 1.28446L12.7155 0L0 12.7155L1.28446 14Z"
            fill={fill}
        />
    </svg>
);
