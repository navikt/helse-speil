import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

const Title = styled(BodyShort)`
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-bottom: 0.25rem;
    letter-spacing: 0.4px;
    color: var(--navds-global-color-gray-600);

    a {
        color: var(--navds-global-color-gray-600);

        &:hover {
            text-decoration: none;
        }

        &:active,
        &:focus {
            outline: none;
            color: var(--navds-semantic-color-text-inverted);
            text-decoration: none;
            background-color: var(--navds-semantic-color-focus);
            box-shadow: 0 0 0 2px var(--navds-semantic-color-focus);
        }
    }
`;

interface CardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = (props) => <Title as="h3" {...props} />;
