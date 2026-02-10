import React, { ReactElement } from 'react';

import { Heading, Modal, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { OverstyringerPrDag } from '@typer/utbetalingstabell';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';

import styles from './Endringslogg.module.css';

type EndringsloggDagerProps = {
    closeModal: () => void;
    showModal: boolean;
    endringer: OverstyringerPrDag[];
};

export const EndringsloggDager = ({ endringer, closeModal, showModal }: EndringsloggDagerProps): ReactElement => (
    <Modal aria-label="Endringslogg modal" closeOnBackdropClick open={showModal} onClose={closeModal} width="1200px">
        <Modal.Header>
            <Heading level="1" size="medium">
                Endringslogg
            </Heading>
        </Modal.Header>
        <Modal.Body>
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        <Table.HeaderCell>Dagtype</Table.HeaderCell>
                        <Table.HeaderCell>Grad</Table.HeaderCell>
                        <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                        <Table.HeaderCell>Kilde</Table.HeaderCell>
                        <Table.HeaderCell>Endret dato og tidspunkt</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {endringer
                        .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                        .map(({ begrunnelse, saksbehandler, timestamp, grad, fraGrad, dag, dato }, i) => (
                            <Table.Row key={i}>
                                <Table.DataCell>{getFormattedDateString(dato)}</Table.DataCell>
                                <Table.DataCell>{dag.visningstekst}</Table.DataCell>
                                <Table.DataCell>
                                    <span className={styles.PreviousValue}>
                                        {typeof fraGrad === 'number' && fraGrad !== grad && `${fraGrad} %`}
                                    </span>{' '}
                                    {typeof grad === 'number' && `${grad} %`}
                                </Table.DataCell>
                                <Table.DataCell className="max-w-100 whitespace-normal!">{begrunnelse}</Table.DataCell>
                                <Table.DataCell>{saksbehandler.ident ?? saksbehandler.navn}</Table.DataCell>
                                <Table.DataCell>{getFormattedDatetimeString(timestamp)}</Table.DataCell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table>
        </Modal.Body>
    </Modal>
);
