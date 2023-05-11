import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { Locked, Unlocked } from '@navikt/ds-icons';
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

export const EditButton: React.FC<EditButtonProps> = ({
    isOpen,
    openText,
    closedText,
    onOpen,
    onClose,
    openIcon,
    closedIcon,
    className,
    ...rest
}) => {
    const icon = isOpen
        ? openIcon ?? <Unlocked height={16} width={16} />
        : closedIcon ?? <Locked height={16} width={16} />;
    return (
        <Button className={classNames(styles.EditButton, className)} onClick={isOpen ? onClose : onOpen} {...rest}>
            <>
                {icon}
                <BodyShort className={classNames(styles.EditButtonText)}>{isOpen ? openText : closedText}</BodyShort>
            </>
        </Button>
    );
};
