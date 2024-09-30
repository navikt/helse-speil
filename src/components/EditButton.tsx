import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import { PadlockLockedIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import styles from './EditButton.module.css';

interface EditButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    isOpen: boolean;
    openText: ReactNode;
    closedText: ReactNode;
    onOpen: () => void;
    onClose: () => void;
    openIcon?: ReactNode;
    closedIcon?: ReactNode;
}

export const EditButton = ({
    isOpen,
    openText,
    closedText,
    onOpen,
    onClose,
    className,
    ...rest
}: EditButtonProps): ReactElement => {
    const icon = isOpen ? <PadlockUnlockedIcon title="Hengelås åpen" /> : <PadlockLockedIcon title="Hengelås lukket" />;
    return (
        <Button
            size="xsmall"
            variant="tertiary"
            className={classNames(styles.EditButton, className)}
            onClick={isOpen ? onClose : onOpen}
            icon={icon}
            {...rest}
        >
            {isOpen ? openText : closedText}
        </Button>
    );
};
