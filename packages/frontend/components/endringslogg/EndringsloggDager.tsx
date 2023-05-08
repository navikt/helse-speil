import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { getFormattedDateString } from '@utils/date';

import { ModalProps } from '../Modal';
import { TableModal } from '../TableModal';

import styles from './Endringslogg.module.css';

interface EndringsloggDagerProps extends ModalProps {
    endringer: Array<OverstyringerPrDag>;
}

export const EndringsloggDager = ({ endringer, ...modalProps }: EndringsloggDagerProps) => (
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
            {endringer
                .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                .map(({ begrunnelse, saksbehandler, timestamp, grad, fraGrad, type, dato }, i) => (
                    <tr key={i}>
                        <td>{getFormattedDateString(dato)}</td>
                        <td>{type}</td>
                        <td>
                            <span className={styles.PreviousValue}>
                                {typeof fraGrad === 'number' && `${fraGrad} %`}
                            </span>{' '}
                            
                            {typeof grad === 'number' && `${grad} %`}
                        </td>
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
