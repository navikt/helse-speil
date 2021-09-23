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
                <td>Grad</td>
                <th>Dagtype</th>
                <th>Kilde</th>
                <th>Kommentar</th>
            </tr>
        </thead>
        <tbody>
            {overstyringer.map(({ timestamp, navn, begrunnelse, grad, type }, i) => (
                <tr key={i}>
                    <td>{timestamp.format(NORSK_DATOFORMAT)}</td>
                    <td>{!!grad && `${grad} %`}</td>
                    <td>{type}</td>
                    <td>{navn}</td>
                    <td>
                        <Begrunnelse as="p">{begrunnelse}</Begrunnelse>
                    </td>
                </tr>
            ))}
        </tbody>
    </TableModal>
);
