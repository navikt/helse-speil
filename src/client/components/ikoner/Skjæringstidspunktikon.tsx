import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const Skjæringstidspunktikon = ({ width = 14, height = 14, className }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 24 24" className={className}>
        <g fill="none">
            <path
                d="M11 13.5C11 14.3284 10.3284 15 9.5 15C8.67157 15 8 14.3284 8 13.5C8 12.6716 8.67157 12 9.5 12C10.3284 12 11 12.6716 11 13.5Z"
                fill="var(--navds-color-text-primary)"
            />
            <path
                d="M18 13.5C18 14.3284 17.3284 15 16.5 15C15.6716 15 15 14.3284 15 13.5C15 12.6716 15.6716 12 16.5 12C17.3284 12 18 12.6716 18 13.5Z"
                fill="var(--navds-color-text-primary)"
            />
            <path
                d="M11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5Z"
                fill="var(--navds-color-text-primary)"
            />
            <path
                d="M18 18.5C18 19.3284 17.3284 20 16.5 20C15.6716 20 15 19.3284 15 18.5C15 17.6716 15.6716 17 16.5 17C17.3284 17 18 17.6716 18 18.5Z"
                fill="var(--navds-color-text-primary)"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21 2H5L5 22H21V2ZM5 0C3.89543 0 3 0.89543 3 2V22C3 23.1046 3.89543 24 5 24H21C22.1046 24 23 23.1046 23 22V2C23 0.895431 22.1046 0 21 0H5Z"
                fill="var(--navds-color-text-primary)"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 6V8H17V6H9ZM8 4C7.44772 4 7 4.44772 7 5V9C7 9.55228 7.44772 10 8 10H18C18.5523 10 19 9.55228 19 9V5C19 4.44772 18.5523 4 18 4H8Z"
                fill="var(--navds-color-text-primary)"
            />
        </g>
    </Ikon>
);
