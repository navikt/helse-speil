import React from 'react';
import { Ikon, IkonProps } from './Ikon';

export const IkonDokumenter = ({ width = 24, height = 20 }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 24 20">
        <path
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21 1V5H22C23.1046 5 24 5.89543 24 7V18C24 19.1046 23.1046 20 22 20H2C0.89543 20 0 19.1046 0 18V2C0 0.89543 0.89543 0 2 0H9.76393C10.4812 0 11.1401 0.383683 11.4958 0.999595L21 1ZM9.76393 2H2V18H22V7H12.2639L9.76393 2ZM19 5V3H12.5L13.5 5H19Z"
            fill="#3E3832"
        />
    </Ikon>
);
