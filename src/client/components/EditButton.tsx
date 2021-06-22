import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Button } from './Button';

const open = (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8 7V5C8 2.24 10.24 0 13 0C15.76 0 18 2.24 18 5H16.1C16.1 3.29 14.71 1.9 13 1.9C11.29 1.9 9.9 3.29 9.9 5V7H8Z"
            fill="#0067C5"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.3444 6H1.47778C0.665 6 0 6.68578 0 7.52396V15.1438C0 15.9819 0.665 16.6677 1.47778 16.6677H10.3444C11.1572 16.6677 11.8222 15.9819 11.8222 15.1438V7.52396C11.8222 6.68578 11.1572 6 10.3444 6ZM10.3444 15.1438H1.47778V7.52396H10.3444V15.1438ZM7.38915 11.3326C7.38915 12.1707 6.72415 12.8565 5.91137 12.8565C5.09859 12.8565 4.43359 12.1707 4.43359 11.3326C4.43359 10.4944 5.09859 9.80859 5.91137 9.80859C6.72415 9.80859 7.38915 10.4944 7.38915 11.3326Z"
            fill="#0067C5"
        />
    </svg>
);

const closed = (
    <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.1668 6.66634H12.0002C12.9168 6.66634 13.6668 7.41634 13.6668 8.33301V16.6663C13.6668 17.583 12.9168 18.333 12.0002 18.333H2.00016C1.0835 18.333 0.333496 17.583 0.333496 16.6663V8.33301C0.333496 7.41634 1.0835 6.66634 2.00016 6.66634H2.8335V4.99967C2.8335 2.69967 4.70016 0.833008 7.00016 0.833008C9.30016 0.833008 11.1668 2.69967 11.1668 4.99967V6.66634ZM7.00016 2.49967C5.61683 2.49967 4.50016 3.61634 4.50016 4.99967V6.66634H9.50016V4.99967C9.50016 3.61634 8.3835 2.49967 7.00016 2.49967ZM2.00016 16.6663V8.33301H12.0002V16.6663H2.00016ZM8.66683 12.4997C8.66683 13.4163 7.91683 14.1663 7.00016 14.1663C6.0835 14.1663 5.3335 13.4163 5.3335 12.4997C5.3335 11.583 6.0835 10.833 7.00016 10.833C7.91683 10.833 8.66683 11.583 8.66683 12.4997Z"
            fill="#0067C5"
        />
    </svg>
);

const BlueButton = styled(Button)`
    display: flex;
    align-items: center;
    color: var(--navds-color-action-default);

    > svg {
        margin-right: 0.5rem;
    }
`;

interface EditButtonProps {
    isOpen: boolean;
    openText: ReactNode;
    closedText: ReactNode;
    onOpen: () => void;
    onClose: () => void;
}

export const EditButton = ({ isOpen, openText, closedText, onOpen, onClose }: EditButtonProps) => (
    <BlueButton onClick={isOpen ? onClose : onOpen}>
        {isOpen ? (
            <>
                {open}
                {openText}
            </>
        ) : (
            <>
                {closed}
                {closedText}
            </>
        )}
    </BlueButton>
);
