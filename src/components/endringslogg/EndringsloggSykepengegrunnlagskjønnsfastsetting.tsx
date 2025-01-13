import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal, Table } from '@navikt/ds-react';

import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { Sykepengegrunnlagskjonnsfastsetting } from '@io/graphql';
import { NORSK_DATOFORMAT, getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Endringslogg.module.css';

type EndringsloggSykepengegrunnlagskjønnsfastsettingProps = {
    onClose: () => void;
    showModal: boolean;
    endringer: Array<Sykepengegrunnlagskjonnsfastsetting>;
};

export const EndringsloggSykepengegrunnlagskjønnsfastsetting = ({
    endringer,
    onClose,
    showModal,
}: EndringsloggSykepengegrunnlagskjønnsfastsettingProps): ReactElement => (
    <Modal
        aria-label="Endringslogg modal"
        width="1200px"
        portal
        closeOnBackdropClick
        open={showModal}
        onClose={onClose}
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
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        <Table.HeaderCell>Sykepengegrunnlag</Table.HeaderCell>
                        <Table.HeaderCell>Skjæringstidpunkt</Table.HeaderCell>
                        <Table.HeaderCell>Årsak</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
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
                                        {somPenger(endring.skjonnsfastsatt.fraArlig)}
                                    </span>{' '}
                                    {somPenger(endring.skjonnsfastsatt.arlig)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {getFormattedDateString(endring.skjonnsfastsatt.skjaeringstidspunkt)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort className={styles.Begrunnelse}>
                                        {endring.skjonnsfastsatt.arsak}
                                    </BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>
                                    <BodyShort className={styles.Begrunnelse}>{endring.skjonnsfastsatt.type}</BodyShort>
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
