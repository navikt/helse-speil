import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal, Table } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { getSkjønnsfastsettelseTypeTekst } from '@saksbilde/historikk/hendelser/SykepengegrunnlagSkjønnsfastsatthendelse';
import { SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/SkjønnsfastsettingHeader';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Endringslogg.module.css';

type EndringsloggSykepengegrunnlagskjønnsfastsettingProps = {
    closeModal: () => void;
    showModal: boolean;
    endringer: SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo[];
};

export const EndringsloggSykepengegrunnlagskjønnsfastsetting = ({
    endringer,
    closeModal,
    showModal,
}: EndringsloggSykepengegrunnlagskjønnsfastsettingProps): ReactElement => (
    <Modal aria-label="Endringslogg modal" width="1200px" closeOnBackdropClick open={showModal} onClose={closeModal}>
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
                        <Table.HeaderCell>Arbeidsgiver</Table.HeaderCell>
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
                                <Table.DataCell>{getFormattedDatetimeString(endring.timestamp)}</Table.DataCell>
                                <Table.DataCell>
                                    <Inntektsforholdnavn inntektsforholdReferanse={endring.inntektsforholdReferanse} />
                                </Table.DataCell>
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
                                    <BodyShort className={styles.Begrunnelse}>
                                        {getSkjønnsfastsettelseTypeTekst(endring.skjonnsfastsatt.type)}
                                    </BodyShort>
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
