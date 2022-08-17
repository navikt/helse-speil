import React from 'react';
import styled from '@emotion/styled';
import { Button } from '@components/Button';

export const DropdownButton = styled(Button)`
    display: flex;
    gap: 0.5rem;
    all: unset;
    height: 32px;
    min-width: 180px;
    font-size: 1rem;
    white-space: nowrap;
    text-align: left;
    padding: 0 16px;
    width: 100%;
    box-sizing: border-box;

    &:hover,
    &:focus {
        background: var(--navds-global-color-blue-100);
        color: var(--navds-semantic-color-text);
        cursor: pointer;
    }

    &:focus-visible,
    &:focus {
        box-shadow: inset 0 0 0 2px var(--navds-semantic-color-focus);
    }

    &:disabled {
        &,
        &:hover {
            background-color: transparent;
            color: var(--navds-semantic-color-text-muted);
        }
    }
`;
