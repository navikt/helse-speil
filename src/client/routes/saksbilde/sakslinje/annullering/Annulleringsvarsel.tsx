import styled from '@emotion/styled';
import React from 'react';

import { Alert } from '@navikt/ds-react';
import type { AlertProps } from '@navikt/ds-react';

const Varsel = styled(Alert)`
    border: none;
    background: none;
    padding: 0;
    font-weight: 600;
    font-size: 1rem;
    line-height: 22px;
    margin-bottom: 2rem;
`;

export const Annulleringsvarsel: React.FC<AlertProps> = ({ children, ...rest }) => (
    <Varsel size="s" {...rest}>
        {children}
    </Varsel>
);
