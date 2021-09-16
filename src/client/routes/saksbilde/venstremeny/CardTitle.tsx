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
    color: #59514b;

    a {
        color: inherit;

        &:hover {
            text-decoration: none;
        }

        &:active,
        &:focus {
            outline: none;
            color: var(--navds-color-text-inverse);
            text-decoration: none;
            background-color: var(--navds-text-focus);
            box-shadow: 0 0 0 2px var(--navds-text-focus);
        }
    }
`;

interface CardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = (props) => <Title component="h3" {...props} />;
