import React from 'react';

export const IconPermisjon = ({ width = 11, height = 16, fill = 'var(--navds-color-text-primary)' }) => (
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
            d="M0.333008 0H6.56234C8.91876 0 10.829 1.91025 10.829 4.26667C10.829 6.62308 8.91876 8.53333 6.56234 8.53333H1.61301V16H0.333008V0ZM1.61301 7.25333H6.56234C8.21183 7.25333 9.54901 5.91616 9.54901 4.26667C9.54901 2.61718 8.21183 1.28 6.56234 1.28H1.61301V7.25333Z"
            fill={fill}
        />
    </svg>
);
