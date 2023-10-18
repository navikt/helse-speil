import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const SortInfoikon = ({ width = 24, height = 24, className }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 24 24" className={className}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 3.25a.75.75 0 0 0-.75.75v16c0 .414.336.75.75.75h16a.75.75 0 0 0 .75-.75V4a.75.75 0 0 0-.75-.75H4Zm.75 16V4.75h14.5v14.5H4.75ZM12 6.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM10.5 10a.75.75 0 0 0 0 1.5h.75v4h-.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-.75v-4.75A.75.75 0 0 0 12 10h-1.5Z"
            fill="currentColor"
        />
    </Ikon>
);
