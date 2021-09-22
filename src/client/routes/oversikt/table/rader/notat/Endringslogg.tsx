import styled from '@emotion/styled';
import React from 'react';

import { Modal as SpeilModal, ModalProps } from '../../../../../components/Modal';

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
    }

    tbody > tr:nth-of-type(2n-1) > td {
        background-color: var(--navds-color-gray-10);
    }
`;

const Modal = styled(SpeilModal)`
    width: max-content;
    padding: 18px 24px;

    > header {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 24px;
    }
`;

interface EndringsloggProps extends ModalProps {}

export const Endringslogg: React.FC<EndringsloggProps> = ({ children, ...modalProps }) => {
    return (
        <Modal {...modalProps}>
            <Table>{children}</Table>
        </Modal>
    );
};
