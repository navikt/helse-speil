import React, { Dispatch, ReactNode, SetStateAction } from 'react';

import { Modal } from '@navikt/ds-react';

import styles from './ModalWrapper.module.scss';

type ModalWrapperProps = {
    erÅpen: boolean;
    setErÅpen: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
};

export const ModalWrapper = ({ erÅpen, setErÅpen, children }: ModalWrapperProps): ReactNode => {
    return erÅpen ? (
        <Modal
            aria-label="Modal"
            portal
            closeOnBackdropClick
            open={erÅpen}
            onClose={() => setErÅpen(false)}
            width="800px"
        >
            <Modal.Header />
            <Modal.Body className={styles.modal}>{children}</Modal.Body>
        </Modal>
    ) : (
        children
    );
};
