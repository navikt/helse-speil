import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Dropdown, Loader } from '@navikt/ds-react';

import styles from './AsyncMenuButton.module.css';

interface AsyncMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asyncOperation: () => Promise<unknown>;
    onSuccess?: (result?: unknown) => void;
    onFail?: (error: Error) => void;
    swallorErrors?: boolean;
}

export const AsyncMenuButton = ({
    children,
    asyncOperation,
    onSuccess,
    onFail,
    swallorErrors = true,
    className,
    ...buttonProps
}: AsyncMenuButtonProps): ReactElement => {
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
        <Dropdown.Menu.List.Item
            onClick={onClick}
            className={classNames(styles.AsyncMenuButton, className)}
            {...buttonProps}
        >
            {children}
            {isPerformingAsyncOperation && <Loader size="xsmall" />}
        </Dropdown.Menu.List.Item>
    );
};
