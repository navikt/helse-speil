import styles from './TableModal.module.scss';
import React from 'react';

import { Modal, ModalProps } from './Modal';

type TableModalProps = ModalProps;

export const TableModal: React.FC<TableModalProps> = ({ children, ...modalProps }) => (
    <Modal className={styles.tablemodal} {...modalProps}>
        <table className={styles.table}>{children}</table>
    </Modal>
);
