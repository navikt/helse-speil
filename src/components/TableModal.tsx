import styles from './TableModal.module.scss';
import React, { PropsWithChildren } from 'react';

import { GammelModal, ModalProps } from './Modal';

type TableModalProps = ModalProps;

export const TableModal = ({ children, ...modalProps }: PropsWithChildren<TableModalProps>) => (
    <GammelModal className={styles.tablemodal} {...modalProps}>
        <table className={styles.table}>{children}</table>
    </GammelModal>
);
