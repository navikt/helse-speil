import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { OverstyringerPrDag } from '@typer/utbetalingstabell';
import { getFormattedDateString } from '@utils/date';

import styles from './Endringslogg.module.css';

type EndringsloggDagerProps = {
    onClose: () => void;
    showModal: boolean;
    endringer: Array<OverstyringerPrDag>;
};

export const EndringsloggDager = ({ endringer, onClose, showModal }: EndringsloggDagerProps): ReactElement => (
    <Modal aria-label="Endringslogg modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
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
                        <Table.HeaderCell>Endret dato</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {endringer
                        .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                        .map(({ begrunnelse, saksbehandler, timestamp, grad, fraGrad, dag, dato }, i) => (
                            <Table.Row key={i}>
                                <Table.DataCell>{getFormattedDateString(dato)}</Table.DataCell>
                                <Table.DataCell>{dag.speilDagtype}</Table.DataCell>
                                <Table.DataCell>
                                    <span className={styles.PreviousValue}>
                                        {typeof fraGrad === 'number' && fraGrad !== grad && `${fraGrad} %`}
                                    </span>{' '}
                                    {typeof grad === 'number' && `${grad} %`}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort className={styles.Begrunnelse}>{begrunnelse}</BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>{saksbehandler.ident ?? saksbehandler.navn}</Table.DataCell>
                                <Table.DataCell>{getFormattedDateString(timestamp)}</Table.DataCell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table>
        </Modal.Body>
    </Modal>
);
