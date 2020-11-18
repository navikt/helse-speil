import React from 'react';

export const IkonArbeidsgiverperiode = ({ width = 16, height = 10, fill = '#3E3832' }) => (
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
            d="M2.00968 3.6196C1.63971 3.6196 1.33978 3.92165 1.33978 4.29425C1.33978 4.66685 1.63971 4.96891 2.00968 4.96891C2.37965 4.96891 2.67957 4.66685 2.67957 4.29425C2.67957 3.92165 2.37965 3.6196 2.00968 3.6196ZM0 4.29425C0 3.17645 0.899763 2.27029 2.00968 2.27029C3.11959 2.27029 4.01935 3.17645 4.01935 4.29425C4.01935 5.41206 3.11959 6.31821 2.00968 6.31821C0.899763 6.31821 0 5.41206 0 4.29425Z"
            fill={fill}
        />
        <path fillRule="evenodd" clipRule="evenodd" d="M11.3882 4.96891H2.67957V3.6196H11.3882V4.96891Z" fill={fill} />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 4.63158L11.2207 9.26316V0L16 4.63158ZM14.0677 4.63158L12.5605 6.09225V3.17091L14.0677 4.63158Z"
            fill={fill}
        />
    </svg>
);
