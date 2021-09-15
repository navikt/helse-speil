import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const Maksdatoikon = ({ width = 14, height = 14, className, alt }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 14 16" className={className} alt={alt}>
        <g fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 15.1765C10.866 15.1765 14 11.7791 14 7.58824C14 3.39737 10.866 0 7 0C3.13401 0 0 3.39737 0 7.58824C0 11.7791 3.13401 15.1765 7 15.1765Z"
                fill="var(--navds-color-danger-default)"
            />
            <ellipse cx="7" cy="7.58775" rx="2" ry="2.16807" fill="white" />
        </g>
    </Ikon>
);
