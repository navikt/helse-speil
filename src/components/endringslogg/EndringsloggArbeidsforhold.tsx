import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { Arbeidsforholdoverstyring } from '@io/graphql';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';

import styles from './Endringslogg.module.css';

type EndringsloggArbeidsforholdProps = {
    closeModal: () => void;
    showModal: boolean;
    endringer: Arbeidsforholdoverstyring[];
};

export const EndringsloggArbeidsforhold = ({
    endringer,
    closeModal,
    showModal,
}: EndringsloggArbeidsforholdProps): ReactElement => (
    <Modal
        aria-label="Endringslogg modal"
        portal
        closeOnBackdropClick
        open={showModal}
        onClose={closeModal}
        width="1200px"
    >
        <Modal.Header>
            <Heading level="1" size="medium">
                Endringslogg
            </Heading>
        </Modal.Header>
        <Modal.Body>
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dato og tidspunkt</Table.HeaderCell>
                        <Table.HeaderCell />
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
                                <Table.DataCell>{getFormattedDatetimeString(endring.timestamp)}</Table.DataCell>
                                <Table.DataCell>
                                    {endring.deaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
                                </Table.DataCell>
                                <Table.DataCell>{getFormattedDateString(endring.skjaeringstidspunkt)}</Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort className={styles.Begrunnelse}>{endring.begrunnelse}</BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort className={styles.Begrunnelse}>{endring.forklaring}</BodyShort>
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
