import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { getFormattedDateString } from '@utils/date';

import { ModalProps } from '../Modal';
import { TableModal } from '../TableModal';

import styles from './Endringslogg.module.css';

interface EndringsloggDagerProps extends ModalProps {
    endringer: Array<OverstyringerPrDag>;
}

export const EndringsloggDager: React.FC<EndringsloggDagerProps> = ({ endringer, ...modalProps }) => {
    return (
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
                {endringer.map(({ begrunnelse, saksbehandler, timestamp, grad, type, dato }, i) => (
                    <tr key={i}>
                        <td>{getFormattedDateString(dato)}</td>
                        <td>{type}</td>
                        <td>{typeof grad === 'number' && `${grad} %`}</td>
                        <td>
                            <BodyShort className={styles.Begrunnelse}>{begrunnelse}</BodyShort>
                        </td>
                        <td>{saksbehandler.ident ?? saksbehandler.navn}</td>
                        <td>{getFormattedDateString(timestamp)}</td>
                    </tr>
                ))}
            </tbody>
        </TableModal>
    );
};
