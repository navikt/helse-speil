import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Button as NavButton, Loader } from '@navikt/ds-react';

const Button = styled(NavButton)`
    all: unset;
    height: 30px;
    min-width: 180px;
    font-size: 1rem;
    white-space: nowrap;
    text-align: left;
    padding: 0.25rem 1rem;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    &:hover,
    &:focus {
        background: var(--navds-color-blue-10);
        color: var(--navds-primary-text);
        cursor: pointer;
    }

    &:disabled {
        &,
        &:hover {
            background-color: transparent;
            color: var(--navds-color-text-disabled);
        }
    }

    > svg {
        margin-left: 0.5rem;
    }
`;

interface AsyncMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asyncOperation: () => Promise<any>;
    onSuccess?: (result?: any) => void;
    onFail?: (error: Error) => void;
    swallorErrors?: boolean;
}

export const AsyncMenuButton = ({
    children,
    asyncOperation,
    onSuccess,
    onFail,
    swallorErrors = true,
    ...rest
}: AsyncMenuButtonProps) => {
    const [isPerformingAsyncOperation, setIsPerformingAsyncOperation] = useState(false);

    const onClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsPerformingAsyncOperation(true);
        asyncOperation()
            .then((result) => {
                setIsPerformingAsyncOperation(false);
                onSuccess?.(result);
                return Promise.resolve(result);
            })
            .catch((error) => {
                onFail?.(error);
                return swallorErrors ? Promise.resolve() : Promise.reject(error);
            });
    };

    return (
        <Button onClick={onClick} {...rest}>
            {children}
            {isPerformingAsyncOperation && <Loader size="xs" />}
        </Button>
    );
};
