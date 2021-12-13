import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Button } from './Button';
import { Locked, Unlocked } from '@navikt/ds-icons';

const BlueButton = styled(Button)`
    display: flex;
    align-items: center;
    color: var(--navds-color-action-default);

    > svg {
        margin-right: 0.5rem;
    }
`;

interface EditButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    isOpen: boolean;
    openText: ReactNode;
    closedText: ReactNode;
    onOpen: () => void;
    onClose: () => void;
}

export const EditButton = ({ isOpen, openText, closedText, onOpen, onClose, ...rest }: EditButtonProps) => (
    <BlueButton onClick={isOpen ? onClose : onOpen} {...rest}>
        {isOpen ? (
            <>
                <Unlocked />
                {openText}
            </>
        ) : (
            <>
                <Locked />
                {closedText}
            </>
        )}
    </BlueButton>
);
