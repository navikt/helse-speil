import styles from './Modal.module.scss';
import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import ReactModal from 'react-modal';

if (process.env.NODE_ENV === 'production') {
    ReactModal.setAppElement('#root');
}

if (ReactModal.defaultStyles.overlay) {
    ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(61, 56, 49, 0.7)';
    ReactModal.defaultStyles.overlay.zIndex = 10000;
}

if (ReactModal.defaultStyles.content) {
    ReactModal.defaultStyles.content.zIndex = 10001;
}

export interface ModalProps {
    isOpen: boolean;
    onRequestClose: (event: React.MouseEvent | React.KeyboardEvent) => void;
    title?: ReactNode;
    className?: string;
    contentLabel?: string;
    shouldReturnFocusAfterClose?: boolean;
    closeIcon?: ReactNode;
}

export const GammelModal = ({
    isOpen,
    onRequestClose,
    title,
    children,
    className = '',
    contentLabel,
    shouldReturnFocusAfterClose,
    closeIcon,
}: PropsWithChildren<ModalProps>): ReactElement => (
    <ReactModal
        id="modal"
        className={classNames(styles.modal, className)}
        isOpen={isOpen}
        contentLabel={contentLabel}
        onRequestClose={onRequestClose}
        shouldReturnFocusAfterClose={shouldReturnFocusAfterClose}
    >
        <section onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
            <header className={styles.topprad}>
                {closeIcon ? (
                    <button className={styles.minimer} onClick={onRequestClose}>
                        {closeIcon}
                    </button>
                ) : (
                    <button className={styles.lukk} onClick={onRequestClose} />
                )}
                {title}
            </header>
            {children}
        </section>
    </ReactModal>
);
