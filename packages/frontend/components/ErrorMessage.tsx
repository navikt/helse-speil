import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

const Text = styled(BodyShort)`
    color: var(--a-text-danger);
    font-weight: 600;
`;

interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, ...rest }) => (
    <Text as="p" {...rest}>
        {children}
    </Text>
);
