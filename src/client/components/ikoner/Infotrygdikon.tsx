import styled from '@emotion/styled';
import React from 'react';

import { Ikon } from './Ikon';

const StyledIkon = styled(Ikon)`
    min-width: 16px;
    min-height: 17px;
    margin: 0 0.5rem;
`;

export const Infotrygdikon = () => (
    <StyledIkon viewBox="0 0 16 17">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.56914 0.109375C7.84846 0.0139972 8.15154 0.0139974 8.43086 0.109375L16 2.69396V12.0161C16 12.5654 15.6631 13.0585 15.1514 13.2582L8 16.049L0.84861 13.2582C0.336884 13.0585 0 12.5654 0 12.0161V2.69396L7.56914 0.109375ZM1.33333 4.14255V12.0161L7.33333 14.3576V6.4574L1.33333 4.14255ZM8.66667 6.4574V14.3576L14.6667 12.0161V4.14255L8.66667 6.4574ZM13.3822 3.20899L8 1.37117L2.61782 3.20899L8 5.28548L13.3822 3.20899Z"
            fill="var(--navds-color-text-primary)"
        />
    </StyledIkon>
);
