import styled from '@emotion/styled';
import React from 'react';

import { Modal as SpeilModal, ModalProps } from './Modal';

const Table = styled.table`
    th,
    td {
        padding: 0.5rem;

        &:not(:last-of-type) {
            padding-right: 1.5rem;
        }
    }

    th {
        text-align: left;
        font-weight: 400;
        font-size: 14px;
        color: var(--navds-color-gray-80);
    }

    tbody > tr:nth-of-type(2n-1) > td {
        background-color: var(--navds-color-gray-10);
    }

    tbody tr.alert td {
        background-color: #f9d2cc;
    }
`;

const Modal = styled(SpeilModal)`
    width: max-content;
    padding: 18px 24px 24px;

    > header {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 24px;
    }
`;

interface TableModalProps extends ModalProps {}

export const TableModal: React.FC<TableModalProps> = ({ children, ...modalProps }) => (
    <Modal {...modalProps}>
        <Table>{children}</Table>
    </Modal>
);
