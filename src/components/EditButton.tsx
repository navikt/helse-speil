import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import { PadlockLockedIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Button } from './Button';

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
    openIcon,
    closedIcon,
    className,
    ...rest
}: EditButtonProps): ReactElement => {
    const icon = isOpen
        ? (openIcon ?? <PadlockUnlockedIcon viewBox="0 0 18 22" fontSize="1.3rem" title="Hengelås åpen" />)
        : (closedIcon ?? <PadlockLockedIcon viewBox="0 0 16 22" fontSize="1.3rem" title="Hengelås lukket" />);
    return (
        <Button className={classNames(styles.EditButton, className)} onClick={isOpen ? onClose : onOpen} {...rest}>
            <>
                {icon}
                <BodyShort className={classNames(styles.EditButtonText)}>{isOpen ? openText : closedText}</BodyShort>
            </>
        </Button>
    );
};
