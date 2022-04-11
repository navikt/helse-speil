import React from 'react';
import styled from '@emotion/styled';
import { Button } from '@components/Button';

export const DropdownButton = styled(Button)`
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
        background: var(--navds-color-blue-10);
        color: var(--navds-primary-text);
        cursor: pointer;
    }

    &:focus-visible,
    &:focus {
        box-shadow: inset 0 0 0 2px var(--navds-text-focus);
    }

    &:disabled {
        &,
        &:hover {
            background-color: transparent;
            color: var(--navds-color-text-disabled);
        }
    }
`;
