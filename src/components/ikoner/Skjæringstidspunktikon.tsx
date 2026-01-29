import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const Skjæringstidspunktikon = ({ width = 16, height = 16, className, alt }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 16 16" className={className} alt={alt}>
        <g fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 4.66667V3.33333H1.33333L1.33333 6.66667H14.6667V3.33333H12V4.66667C12 5.03486 11.7015 5.33333 11.3333 5.33333C10.9651 5.33333 10.6667 5.03486 10.6667 4.66667V3.33333H5.33333V4.66667C5.33333 5.03486 5.03486 5.33333 4.66667 5.33333C4.29848 5.33333 4 5.03486 4 4.66667ZM10.6667 2H5.33333V0.666667C5.33333 0.298477 5.03486 0 4.66667 0C4.29848 0 4 0.298477 4 0.666667V2H1.33333C0.596954 2 0 2.59695 0 3.33333V14.6667C0 15.403 0.596953 16 1.33333 16H14.6667C15.403 16 16 15.403 16 14.6667V3.33333C16 2.59695 15.403 2 14.6667 2H12V0.666667C12 0.298477 11.7015 0 11.3333 0C10.9651 0 10.6667 0.298477 10.6667 0.666667V2ZM1.33333 8L1.33333 14.6667H14.6667V8H1.33333Z"
                fill="var(--ax-text-neutral)"
            />
            <circle cx="8" cy="11" r="2" fill="#0067C5" />
        </g>
    </Ikon>
);
