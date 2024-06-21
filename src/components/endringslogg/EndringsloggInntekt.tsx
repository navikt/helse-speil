import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { Inntektoverstyring } from '@io/graphql';
import { NORSK_DATOFORMAT, getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Endringslogg.module.css';

type EndringsloggInntektProps = {
    onClose: () => void;
    showModal: boolean;
    endringer: Array<Inntektoverstyring>;
};

export const EndringsloggInntekt = ({ endringer, onClose, showModal }: EndringsloggInntektProps): ReactElement => (
    <Modal aria-label="Endringslogg modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
        <Modal.Header>
            <Heading level="1" size="small">
                Endringslogg
            </Heading>
        </Modal.Header>
        <Modal.Body>
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        <Table.HeaderCell>Månedsbeløp</Table.HeaderCell>
                        <Table.HeaderCell>Skjæringstidspunkt</Table.HeaderCell>
                        <Table.HeaderCell>Begrunnelse</Table.HeaderCell>
                        <Table.HeaderCell>Forklaring</Table.HeaderCell>
                        <Table.HeaderCell>Kilde</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {endringer
                        .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                        .map((endring, i) => (
                            <Table.Row key={i}>
                                <Table.DataCell>{dayjs(endring.timestamp).format(NORSK_DATOFORMAT)}</Table.DataCell>
                                <Table.DataCell>
                                    <span className={styles.PreviousValue}>
                                        {somPenger(endring.inntekt.fraManedligInntekt)}
                                    </span>{' '}
                                    {somPenger(endring.inntekt.manedligInntekt)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {getFormattedDateString(endring.inntekt.skjaeringstidspunkt)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort className={styles.Begrunnelse}>{endring.inntekt.begrunnelse}</BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort className={styles.Begrunnelse}>{endring.inntekt.forklaring}</BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>
                                    {endring.saksbehandler.ident ?? endring.saksbehandler.navn}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table>
        </Modal.Body>
    </Modal>
);
