import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const IkonDialog = ({ width = 24, height = 24 }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 24 24">
        <path
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 5C22.2091 5 24 6.79086 24 9V24L18.75 21H8C5.79086 21 4 19.2091 4 17V9C4 6.79086 5.79086 5 8 5H20ZM20 7H8C6.94564 7 6.08183 7.81588 6.00549 8.85074L6 17C6 18.0544 6.81588 18.9182 7.85074 18.9945L8 19H19.2811L22 20.553V9C22 7.94564 21.1841 7.08183 20.1493 7.00549L20 7ZM14 0C16.1422 0 17.8911 1.68397 17.9951 3.80036L18 5H16L15.9945 3.85074C15.922 2.86762 15.1388 2.08214 14.1567 2.00604L14 2H4L3.85074 2.00549C2.86762 2.07802 2.08214 2.86123 2.00604 3.84335L2 4V14.553L4 13.41V15.714L0 18V4C0 1.8578 1.68397 0.108921 3.80036 0.00489531L4 0H14ZM10 12C10.5523 12 11 12.4477 11 13C11 13.5523 10.5523 14 10 14C9.44771 14 9 13.5523 9 13C9 12.4477 9.44771 12 10 12ZM14 12C14.5523 12 15 12.4477 15 13C15 13.5523 14.5523 14 14 14C13.4477 14 13 13.5523 13 13C13 12.4477 13.4477 12 14 12ZM18 12C18.5523 12 19 12.4477 19 13C19 13.5523 18.5523 14 18 14C17.4477 14 17 13.5523 17 13C17 12.4477 17.4477 12 18 12Z"
            fill="var(--navds-semantic-color-text)"
        />
    </Ikon>
);
