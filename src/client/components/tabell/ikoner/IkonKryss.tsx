import React from 'react';

export const IkonKryss = ({ width = 16, height = 16, fill = '#78706A' }) => (
    <svg width={width} height={height} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 0.923077L6.92308 6L12 11.0769L11.0769 12L6 6.92308L0.923077 12L0 11.0769L5.07692 6L0 0.923077L0.923077 0L6 5.07692L11.0769 0L12 0.923077Z"
            fill={fill}
        />
    </svg>
);
