import styled from '@emotion/styled';
import React from 'react';

import { Ikon } from './Ikon';

interface ArbeidsgiverikonProps {
    className?: string;
    width?: number;
    height?: number;
    alt?: string;
}

const StyledIkon = styled(Ikon)`
    min-width: 16px;
    min-height: 20px;
    margin: 0 0.5rem;
`;

export const Arbeidsgiverikon = ({ className, width, height, alt }: ArbeidsgiverikonProps) => (
    <StyledIkon className={className} width={width} height={height} viewBox="0 1 16 20" alt={alt}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 1.66113C10.7364 1.66113 11.3333 2.37118 11.3333 3.24706V4.83299H14.6667C15.403 4.83299 16 5.54304 16 6.41892V10.3837C16 11.1878 15.6546 11.5452 15.334 11.9697L15.3333 17.5204C15.3333 18.3963 14.7364 19.1064 14 19.1064H2C1.26362 19.1064 0.666667 18.3963 0.666667 17.5204L0.666629 11.9697C0.308512 11.5655 0 11.1881 0 10.3837V6.41892C0 5.54304 0.596954 4.83299 1.33333 4.83299H4.66667V3.24706C4.66667 2.37118 5.26362 1.66113 6 1.66113H10ZM7.33333 12.7626H2V17.5204H14V12.7626H8.66667V14.3486H7.33333V12.7626ZM14.6667 6.41892H1.33333V9.59078C1.33333 10.4269 1.87725 11.1118 2.56716 11.1724L2.66667 11.1767H13.3333C14.0362 11.1767 14.6121 10.5297 14.663 9.70914L14.6667 9.59078V6.41892ZM10 3.24706H6V4.83299H10V3.24706Z"
            fill="var(--navds-color-text-primary)"
        />
    </StyledIkon>
);
