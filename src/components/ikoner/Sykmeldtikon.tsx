import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const Sykmeldtikon = ({ width = 16, height = 16, className, alt }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 16 16" className={className} alt={alt}>
        <g fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00098 1.6C6.67549 1.6 5.60098 2.67452 5.60098 4C5.60098 5.32548 6.67549 6.4 8.00098 6.4C9.32646 6.4 10.401 5.32548 10.401 4C10.401 2.67452 9.32646 1.6 8.00098 1.6ZM4.00098 4C4.00098 1.79086 5.79184 0 8.00098 0C10.2101 0 12.001 1.79086 12.001 4C12.001 6.20914 10.2101 8 8.00098 8C5.79184 8 4.00098 6.20914 4.00098 4Z"
                fill="var(--ax-text-neutral)"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 10.0267C4.68629 10.0267 2 12.319 2 15.1467V16.0001H0V15.1467C0 11.3765 3.58172 8.32007 8 8.32007C12.4183 8.32007 16 11.3765 16 15.1467V16.0001H14V15.1467C14 12.319 11.3137 10.0267 8 10.0267Z"
                fill="var(--ax-text-neutral)"
            />
        </g>
    </Ikon>
);
