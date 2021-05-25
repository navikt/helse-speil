import styled from '@emotion/styled';
import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';

if (ReactModal.defaultStyles.overlay) {
    ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(61, 56, 49, 0.7)';
    ReactModal.defaultStyles.overlay.zIndex = 10000;
}

if (ReactModal.defaultStyles.content) {
    ReactModal.defaultStyles.content.zIndex = 10001;
}

const SpeilModal = styled(ReactModal)`
    background: var(--navds-color-background);
    width: max-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    outline: none;
    max-height: calc(100vh - 2rem);
    max-width: calc(100vw - 2rem);
    overflow: auto;

    &:focus {
        box-shadow: 0 0 0 3px var(--navds-text-focus);
    }
`;

const Lukknapp = styled.button`
    position: relative;
    cursor: pointer;
    color: var(--navds-color-action-default);
    height: 2rem;
    width: 2rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;

    &:before,
    &:after {
        content: '';
        position: absolute;
        width: 1.25rem;
        height: 3px;
        top: 50%;
        left: 50%;
        background-color: currentColor;
    }

    &:before {
        transform: translate(-50%, -50%) rotate(-45deg);
    }

    &:after {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &:hover,
    &:focus {
        background: var(--navds-color-action-default);
    }

    &:active {
        background: var(--navds-text-focus);
    }

    &:hover:before,
    &:focus:before,
    &:hover:after,
    &:focus:after,
    &:active:before,
    &:active:after {
        background: var(--navds-color-background);
    }
`;

const Topprad = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
`;

interface ModalProps {
    isOpen: boolean;
    contentLabel: string;
    onRequestClose: () => void;
    title?: ReactNode;
    className?: string;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
    isOpen,
    contentLabel,
    onRequestClose,
    title,
    children,
    className,
}) => (
    <SpeilModal
        id="modal"
        className={className}
        isOpen={isOpen}
        contentLabel={contentLabel}
        onRequestClose={onRequestClose}
    >
        <Topprad>
            <Lukknapp onClick={onRequestClose} />
            {title}
        </Topprad>
        {children}
    </SpeilModal>
);
