import styles from './TableModal.module.scss';
import React, { PropsWithChildren } from 'react';

import { Modal, ModalProps } from './Modal';

type TableModalProps = ModalProps;

export const TableModal = ({ children, ...modalProps }: PropsWithChildren<TableModalProps>) => (
    <Modal className={styles.tablemodal} {...modalProps}>
        <table className={styles.table}>{children}</table>
    </Modal>
);
