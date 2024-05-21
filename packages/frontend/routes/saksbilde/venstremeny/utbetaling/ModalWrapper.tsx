import styles from './ModalWrapper.module.scss';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';

import { Modal } from '@components/Modal';

interface ModalWrapperProps {
    erÅpen: boolean;
    setErÅpen: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
}

export const ModalWrapper = ({ erÅpen, setErÅpen, children }: ModalWrapperProps) => {
    return erÅpen ? (
        <Modal isOpen={erÅpen} onRequestClose={() => setErÅpen(false)} className={styles.modal}>
            {children}
        </Modal>
    ) : (
        children
    );
};
