import cn from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Heading, Modal, Table } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import {
    TilkommenInntekt,
    TilkommenInntektEndretEvent,
    TilkommenInntektFjernetEvent,
    TilkommenInntektGjenopprettetEvent,
    TilkommenInntektOpprettetEvent,
} from '@io/graphql';
import { somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Endringslogg.module.css';

type EndringsloggTilkommenInntektProps = {
    closeModal: () => void;
    showModal: boolean;
    tilkommenInntekt: TilkommenInntekt;
};

export const EndringsloggTilkommenInntekt = ({
    tilkommenInntekt,
    closeModal,
    showModal,
}: EndringsloggTilkommenInntektProps): ReactElement => (
    <Modal
        aria-label="Endringslogg modal"
        width="1200px"
        portal
        closeOnBackdropClick
        open={showModal}
        onClose={closeModal}
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
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Organisasjonsnummer</Table.HeaderCell>
                        <Table.HeaderCell>Periode f.o.m. - t.o.m.</Table.HeaderCell>
                        <Table.HeaderCell>Inntekt for perioden</Table.HeaderCell>
                        <Table.HeaderCell>Dager som ikke skal graderes</Table.HeaderCell>
                        <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tilkommenInntekt.events
                        .toSorted((a, b) => b.metadata.sekvensnummer - a.metadata.sekvensnummer)
                        .map(
                            (
                                event,
                            ):
                                | TilkommenInntektOpprettetEvent
                                | TilkommenInntektEndretEvent
                                | TilkommenInntektFjernetEvent
                                | TilkommenInntektGjenopprettetEvent =>
                                event as
                                    | TilkommenInntektOpprettetEvent
                                    | TilkommenInntektEndretEvent
                                    | TilkommenInntektFjernetEvent
                                    | TilkommenInntektGjenopprettetEvent,
                        )
                        .filter((event) => event.__typename !== 'TilkommenInntektFjernetEvent')
                        .map((event, i) => (
                            <Table.Row key={i}>
                                <Table.DataCell>{somNorskDato(event.metadata.tidspunkt)}</Table.DataCell>
                                <Table.DataCell>
                                    {event.__typename === 'TilkommenInntektOpprettetEvent'
                                        ? 'Lagt til'
                                        : event.__typename === 'TilkommenInntektEndretEvent'
                                          ? 'Endret'
                                          : 'Gjenopprettet'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {event.__typename === 'TilkommenInntektOpprettetEvent' ? (
                                        <AnonymizableTextWithEllipsis>
                                            {event.organisasjonsnummer}
                                        </AnonymizableTextWithEllipsis>
                                    ) : (
                                        event.endringer.organisasjonsnummer && (
                                            <>
                                                <AnonymizableTextWithEllipsis className={styles.PreviousValue}>
                                                    {event.endringer.organisasjonsnummer.fra}
                                                </AnonymizableTextWithEllipsis>
                                                <AnonymizableTextWithEllipsis>
                                                    {event.endringer.organisasjonsnummer.til}
                                                </AnonymizableTextWithEllipsis>
                                            </>
                                        )
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {event.__typename === 'TilkommenInntektOpprettetEvent' ? (
                                        <BodyShort>
                                            {somNorskDato(event.periode.fom)} - {somNorskDato(event.periode.tom)}
                                        </BodyShort>
                                    ) : (
                                        event.endringer.periode && (
                                            <>
                                                <BodyShort className={styles.PreviousValue}>
                                                    {somNorskDato(event.endringer.periode.fra.fom)} -{' '}
                                                    {somNorskDato(event.endringer.periode.fra.tom)}
                                                </BodyShort>
                                                <BodyShort>
                                                    {somNorskDato(event.endringer.periode.til.fom)} -{' '}
                                                    {somNorskDato(event.endringer.periode.til.tom)}
                                                </BodyShort>
                                            </>
                                        )
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {event.__typename === 'TilkommenInntektOpprettetEvent' ? (
                                        <BodyShort>{somPenger(Number(event.periodebelop))}</BodyShort>
                                    ) : (
                                        event.endringer.periodebelop && (
                                            <>
                                                <BodyShort className={styles.PreviousValue}>
                                                    {somPenger(Number(event.endringer.periodebelop.fra))}
                                                </BodyShort>
                                                <BodyShort>
                                                    {somPenger(Number(event.endringer.periodebelop.til))}
                                                </BodyShort>
                                            </>
                                        )
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {event.__typename === 'TilkommenInntektOpprettetEvent' ? (
                                        <>
                                            {event.ekskluderteUkedager.map((dag) => (
                                                <BodyShort key={dag}>{somNorskDato(dag)}</BodyShort>
                                            ))}
                                        </>
                                    ) : (
                                        event.endringer.ekskluderteUkedager && (
                                            <>
                                                {event.endringer.ekskluderteUkedager.fra
                                                    .filter(
                                                        (dag) =>
                                                            !event.endringer.ekskluderteUkedager!.til.includes(dag),
                                                    )
                                                    .map((dag) => ({ dag: dag, handling: 'fjernet' }))
                                                    .concat(
                                                        event.endringer.ekskluderteUkedager.fra
                                                            .filter((dag) =>
                                                                event.endringer.ekskluderteUkedager!.til.includes(dag),
                                                            )
                                                            .map((dag) => ({ dag: dag, handling: 'beholdt' })),
                                                    )
                                                    .concat(
                                                        event.endringer.ekskluderteUkedager.til
                                                            .filter(
                                                                (dag) =>
                                                                    !event.endringer.ekskluderteUkedager!.fra.includes(
                                                                        dag,
                                                                    ),
                                                            )
                                                            .map((dag) => ({ dag: dag, handling: 'lagt til' })),
                                                    )
                                                    .sort((a, b) => a.dag.localeCompare(b.dag))
                                                    .map(({ dag, handling }) => (
                                                        <BodyShort
                                                            key={dag}
                                                            className={cn(
                                                                handling === 'fjernet' && styles.PreviousValue,
                                                            )}
                                                            textColor={handling === 'lagt til' ? 'default' : 'subtle'}
                                                        >
                                                            {somNorskDato(dag)}
                                                        </BodyShort>
                                                    ))}
                                            </>
                                        )
                                    )}
                                </Table.DataCell>
                                <Table.DataCell>{event.metadata.utfortAvSaksbehandlerIdent}</Table.DataCell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table>
        </Modal.Body>
    </Modal>
);
