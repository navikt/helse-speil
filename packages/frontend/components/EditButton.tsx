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
}) => (
    <Button className={classNames(styles.EditButton, className)} onClick={isOpen ? onClose : onOpen} {...rest}>
        {isOpen ? (
            <>
                {openIcon ?? <Unlocked height={16} width={16} />}
                <BodyShort>{openText}</BodyShort>
            </>
        ) : (
            <>
                {closedIcon ?? <Locked height={16} width={16} />}
                <BodyShort>{closedText}</BodyShort>
            </>
        )}
    </Button>
);
