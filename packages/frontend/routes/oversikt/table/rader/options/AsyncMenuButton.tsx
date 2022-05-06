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

    &:hover,
    &:focus {
        background: var(--navds-global-color-blue-100);
        color: var(--navds-semantic-color-text);
        cursor: pointer;
    }

    &:disabled {
        &,
        &:hover {
            background-color: transparent;
            color: var(--navds-semantic-color-text-muted);
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
        <Button as="button" onClick={onClick} {...rest}>
            {children}
            {isPerformingAsyncOperation && <Loader size="xsmall" />}
        </Button>
    );
};
