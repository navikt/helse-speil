import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const Utropstegnikon = ({ alt }: IkonProps) => (
    <Ikon viewBox="0 0 3 14" fill="none" xmlns="http://www.w3.org/2000/svg" alt={alt}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.52717 13.9998C1.51817 13.9998 1.50917 13.9998 1.50017 13.9998C0.682713 13.9998 0.0137499 13.3459 0.000250686 12.5269C-0.0147485 11.699 0.645215 11.015 1.47317 11.0015C1.48217 11.0015 1.49117 11 1.50017 11C2.31762 11 2.98508 11.6555 3.00008 12.4744C3.01508 13.3024 2.35362 13.9848 1.52717 13.9998Z"
            fill="var(--ax-text-neutral)"
        />
        <path
            d="M1.5 0C2.05228 0 2.5 0.447715 2.5 1V8C2.5 8.55229 2.05228 9 1.5 9C0.947715 9 0.5 8.55229 0.5 8V1C0.5 0.447715 0.947715 0 1.5 0Z"
            fill="var(--ax-text-neutral)"
        />
    </Ikon>
);
