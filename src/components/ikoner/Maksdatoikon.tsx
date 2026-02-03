import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const Maksdatoikon = ({ width = 16, height = 16, className, alt }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 16 16" className={className} alt={alt}>
        <g fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
                fill="var(--ax-bg-danger-strong)"
            />
            <circle cx="7.99958" cy="7.99946" r="2.28571" fill="var(--ax-text-neutral-contrast)" />
        </g>
    </Ikon>
);
