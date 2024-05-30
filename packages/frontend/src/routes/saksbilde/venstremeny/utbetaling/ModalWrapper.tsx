import styles from './ModalWrapper.module.scss';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';

import { Modal } from '@components/Modal';

interface ModalWrapperProps {
    erÅpen: boolean;
    setErÅpen: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    closeIcon?: ReactNode;
}

export const ModalWrapper = ({ erÅpen, setErÅpen, closeIcon, children }: ModalWrapperProps) => {
    return erÅpen ? (
        <Modal isOpen={erÅpen} onRequestClose={() => setErÅpen(false)} className={styles.modal} closeIcon={closeIcon}>
            {children}
        </Modal>
    ) : (
        children
    );
};
