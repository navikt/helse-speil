import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

const Title = styled(BodyShort)`
    font-size: var(--a-font-size-medium);
    font-weight: 600;
    display: flex;
    align-items: center;
    color: var(--a-gray-600);

    a {
        color: var(--a-gray-600);

        &:hover {
            text-decoration: none;
        }

        &:active,
        &:focus {
            outline: none;
            color: var(--a-text-on-inverted);
            text-decoration: none;
            background-color: var(--a-border-focus);
            box-shadow: 0 0 0 2px var(--a-border-focus);
        }
    }
`;

interface CardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = (props) => <Title as="h3" {...props} />;
