import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '../utils/date';

import { ModalProps } from './Modal';
import { TableModal } from './TableModal';

const Begrunnelse = styled(BodyShort)`
    max-width: 300px;
`;

interface EndringsloggProps extends ModalProps {
    overstyringer: Dagoverstyring[];
}

export const Endringslogg: React.FC<EndringsloggProps> = ({ overstyringer, ...modalProps }) => (
    <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
        <thead>
            <tr>
                <th>Dato</th>
                <th>Dagtype</th>
                <th>Grad</th>
                <th>Begrunnelse</th>
                <th>Kilde</th>
                <th>Endret dato</th>
            </tr>
        </thead>
        <tbody>
            {overstyringer.map(({ timestamp, ident, begrunnelse, grad, type, dato }, i) => (
                <tr key={i}>
                    <td>{dato?.format(NORSK_DATOFORMAT)}</td>
                    <td>{type}</td>
                    <td>{!!grad && `${grad} %`}</td>
                    <td>
                        <Begrunnelse as="p">{begrunnelse}</Begrunnelse>
                    </td>
                    <td>{ident}</td>
                    <td>{timestamp.format(NORSK_DATOFORMAT)}</td>
                </tr>
            ))}
        </tbody>
    </TableModal>
);
