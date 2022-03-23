import React from 'react';
import dayjs from 'dayjs';
import { BodyShort } from '@navikt/ds-react';

import { Dagoverstyring } from '@io/graphql';
import { getFormattedDateString, NORSK_DATOFORMAT } from '@utils/date';

import { ModalProps } from './Modal';
import { TableModal } from './TableModal';

import styles from './Endringslogg.module.css';

interface EndringsloggDagerProps extends ModalProps {
    endring: Dagoverstyring;
}

export const EndringsloggDager: React.FC<EndringsloggDagerProps> = ({ endring, ...modalProps }) => {
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
                {endring.dager.map(({ grad, type, dato }, i) => (
                    <tr key={i}>
                        <td>{dayjs(dato).format(NORSK_DATOFORMAT)}</td>
                        <td>{type}</td>
                        <td>{typeof grad === 'number' && `${grad} %`}</td>
                        <td>
                            <BodyShort className={styles.Begrunnelse}>{endring.begrunnelse}</BodyShort>
                        </td>
                        <td>{endring.saksbehandler.ident ?? endring.saksbehandler.navn}</td>
                        <td>{getFormattedDateString(endring.timestamp)}</td>
                    </tr>
                ))}
            </tbody>
        </TableModal>
    );
};
