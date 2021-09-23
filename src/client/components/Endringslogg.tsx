import React from 'react';

import { NORSK_DATOFORMAT } from '../utils/date';

import { ModalProps } from './Modal';
import { TableModal } from './TableModal';

interface EndringsloggProps extends ModalProps {
    overstyringer: Dagoverstyring[];
}

export const Endringslogg: React.FC<EndringsloggProps> = ({ overstyringer, ...modalProps }) => (
    <TableModal {...modalProps} title="Endringslogg" contentLabel="Endringslogg">
        <thead>
            <tr>
                <th>Dato</th>
                <th>Kilde</th>
                <th>Kommentar</th>
            </tr>
        </thead>
        <tbody>
            {overstyringer.map(({ timestamp, navn, begrunnelse }, i) => (
                <tr key={i}>
                    <td>{timestamp.format(NORSK_DATOFORMAT)}</td>
                    <td>{navn}</td>
                    <td>{begrunnelse}</td>
                </tr>
            ))}
        </tbody>
    </TableModal>
);
